declare global {
    interface Window {
        SpeechRecognition?: any;
        webkitSpeechRecognition?: any;
    }
}

interface AIAssistantResponse {
    text: string;
    timestamp: number;
    isFromUser?: boolean;
}

type ContactFormCallback = () => void;
interface QAMapItem {
    patterns: string[];
    responses: string[];
}

class AIAssistant {
    private static instance: AIAssistant;
    private speechSynthesis: SpeechSynthesis | null = null;
    private speechRecognition: any = null;
    private voices: SpeechSynthesisVoice[] = [];
    private preferredVoice: SpeechSynthesisVoice | null = null;
    private isSpeaking: boolean = false;
    private isListening: boolean = false;
    private responseHistory: AIAssistantResponse[] = [];
    private assistantName: string = "StellarForge";
    private lastInteractionTime: number = 0;
    private onSpeechEndCallback: (() => void) | null = null;
    private onUserResponseCallback: ((response: string) => void) | null = null;
    private contactFormCallback: ContactFormCallback | null = null;
    private hasAskedAboutContact: boolean = false;
    private userWantsContact: boolean = false;
    private interactionCompleted: boolean = false;
    private recognitionRetryCount: number = 0;
    private maxRetries: number = 3;
    private lastProcessedCommand: string = '';
    private lastCommandTime: number = 0;
    private commandDebounceTime: number = 1000; 
    private isActive: boolean = false;
    private qaMap: QAMapItem[] = [
        {
            patterns: ['who are you', 'your name', 'who is speaking', 'tell me about yourself', 'who am i talking to', 'what are you'],
            responses: [
                `I am ${this.assistantName}, an AI assistant built directly into this portfolio. I run completely in your browser with no external APIs. Think of me as a J.A.R.V.I.S-inspired guide to help you explore Rishi's work.`
            ]
        },
        {
            patterns: ['about rishi', 'who is rishi', 'portfolio owner', 'tell me about the developer', 'developer', 'creator'],
            responses: [
                `Rishi is a passionate FullStack Web Developer who creates immersive digital experiences. He specializes in bridging the gap between design and development, where creativity meets functionality.`,
                `Rishi is a talented developer who focuses on creating innovative web applications. His expertise spans both frontend and backend technologies, with a keen eye for user experience.`
            ]
        },
        {
            patterns: ['skills', 'technologies', 'tech stack', 'programming languages', 'frameworks', 'what can rishi do', 'techs'],
            responses: [
                `Rishi's skills include React, Next.js, TypeScript, Node.js, and various cloud technologies. He's proficient in creating responsive, high-performance web applications with elegant user interfaces.`,
                `Rishi works with modern web technologies including React and Next.js for frontend, Node.js for backend, and various database solutions. He's also skilled in UI/UX design implementation.`
            ]
        },
        {
            patterns: ['projects', 'portfolio', 'work', 'what has rishi built', 'applications', 'apps', 'websites'],
            responses: [
                `Rishi has developed several impressive projects showcasing full-stack development skills. These include web applications with modern UI/UX, backend APIs, and database integration. You can view them in the projects section below.`,
                `Rishi's portfolio includes a variety of projects demonstrating expertise in frontend and backend development. Each project showcases different aspects of his technical abilities and creative approach.`
            ]
        },
        {
            patterns: ['contact', 'hire', 'get in touch', 'email', 'reach out', 'connect', 'message'],
            responses: [
                `Would you like to contact Rishi? I can help with that.`,
                `Interested in reaching out to Rishi? I can assist with that.`
            ]
        },
        {
            patterns: ['how does this work', 'how do you work', 'are you using api', 'are you online', 'how are you working'],
            responses: [
                `I'm built directly into this portfolio and run completely in your browser using the Web Speech API. No external servers or APIs are involved, making me 100% client-side and privacy-friendly.`,
                `I'm a fully client-side AI assistant built with JavaScript and the Web Speech API. I don't use any external services or APIs - everything happens right here in your browser.`
            ]
        },
        {
            patterns: ['stop', 'stop listening', 'shut down', 'power off', 'goodbye', 'bye', 'exit', 'end'],
            responses: [
                `Arc reactor powering down. I'll stop listening now. Hover over the reactor again if you need assistance.`,
                `Shutting down active systems. You can reactivate me by hovering over the arc reactor again.`
            ]
        }
    ];

    private constructor() {
        // Initialize in client-side only
        if (typeof window !== 'undefined') {
            this.speechSynthesis = window.speechSynthesis;

            // Initialize speech recognition
            const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.speechRecognition = new SpeechRecognition();
                this.configureSpeechRecognition();
            }

            this.loadVoices();
            this.lastInteractionTime = Date.now();

            // Load previous conversation history from localStorage
            this.loadHistoryFromStorage();
        }
    }

    public static getInstance(): AIAssistant {
        if (!AIAssistant.instance) {
            AIAssistant.instance = new AIAssistant();
        }
        return AIAssistant.instance;
    }

    private configureSpeechRecognition(): void {
        if (!this.speechRecognition) return;

        this.speechRecognition.continuous = false;
        this.speechRecognition.lang = 'en-US';
        this.speechRecognition.interimResults = false;
        this.speechRecognition.maxAlternatives = 1;

        this.speechRecognition.onresult = (event: any) => {
            const userSpeech = event.results[0][0].transcript;
            console.log('User said:', userSpeech);

            // If we're no longer active, don't process the speech
            if (!this.isActive) {
                console.log('Assistant is no longer active, ignoring speech input');
                return;
            }

            // Reset retry count on successful recognition
            this.recognitionRetryCount = 0;

            // Store user's speech in history
            this.storeResponse(userSpeech, true);

            // Handle contact form request if we've asked about it
            if (this.hasAskedAboutContact && !this.userWantsContact) {
                if (this.checkForYesResponse(userSpeech)) {
                    this.userWantsContact = true;
                    if (this.contactFormCallback) {
                        // Call the callback after responding
                        setTimeout(() => {
                            if (this.contactFormCallback && this.isActive) {
                                this.contactFormCallback!();
                                this.interactionCompleted = true; // Mark interaction as completed
                            }
                        }, 500);
                        return this.speak("Great! I'm opening the contact form for you now.");
                    }
                } else if (this.checkForNoResponse(userSpeech)) {
                    this.hasAskedAboutContact = false; // Reset so we can ask again
                    return this.speak("No problem. Feel free to ask if you have any other questions about Rishi's work.");
                }
            }

            // Check if this command is being processed too soon after a previous one
            const now = Date.now();
            if (this.lastCommandTime > 0 &&
                now - this.lastCommandTime < this.commandDebounceTime &&
                this.isSimilarCommand(userSpeech, this.lastProcessedCommand)) {
                console.log('Command debounced, too similar to previous command');
                return this.startListeningWithDelay(1000); // Restart listening without responding
            }

            // Process the response
            const assistantResponse = this.processInput(userSpeech);

            // Update last processed command info
            this.lastProcessedCommand = userSpeech.toLowerCase();
            this.lastCommandTime = now;

            // Call the callback if provided
            if (this.onUserResponseCallback) {
                this.onUserResponseCallback(userSpeech);
            }

            // Respond to the user's speech only if we're still active
            if (this.isActive) {
                setTimeout(() => {
                    this.speak(assistantResponse);
                }, 300);
            }
        };

        this.speechRecognition.onend = () => {
            this.isListening = false;
            console.log('Speech recognition ended');

            // If we're still active and haven't completed the interaction, retry on no-speech errors
            if (this.isActive && !this.interactionCompleted && this.recognitionRetryCount < this.maxRetries) {
                console.log(`Retrying recognition (${this.recognitionRetryCount + 1}/${this.maxRetries})`);
                this.recognitionRetryCount++;
                this.startListeningWithDelay(300);
            }
        };

        this.speechRecognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            this.isListening = false;

            // Only retry for no-speech errors if we're still active
            if (event.error === 'no-speech' && this.isActive && !this.interactionCompleted && this.recognitionRetryCount < this.maxRetries) {
                console.log(`Retrying after no-speech error (${this.recognitionRetryCount + 1}/${this.maxRetries})`);
                this.recognitionRetryCount++;
                this.startListeningWithDelay(500);
            }
        };
    }

    private isSimilarCommand(newCommand: string, oldCommand: string): boolean {
        const newCmd = newCommand.toLowerCase().trim();
        const oldCmd = oldCommand.toLowerCase().trim();

        if (newCmd === oldCmd) return true;
        if (oldCmd.includes(newCmd) || newCmd.includes(oldCmd)) return true;
        if (Math.abs(newCmd.length - oldCmd.length) < 5) {
            const distance = this.levenshteinDistance(newCmd, oldCmd);
            const similarity = 1 - distance / Math.max(newCmd.length, oldCmd.length);
            return similarity > 0.7;
        }

        return false;
    }

    private levenshteinDistance(a: string, b: string): number {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill matrix
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                const cost = a[j - 1] === b[i - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        return matrix[b.length][a.length];
    }

    private loadVoices(): void {
        if (!this.speechSynthesis) return;
        const voicesChanged = () => {
            this.voices = this.speechSynthesis?.getVoices() || [];
            this.preferredVoice = this.voices.find(
                (voice) => voice.name.includes('English') &&
                    (voice.name.includes('Male') || voice.name.includes('UK'))
            ) || this.voices.find(
                (voice) => voice.lang.includes('en') &&
                    (voice.name.includes('Male') || voice.name.includes('UK'))
            ) || this.voices.find(
                (voice) => voice.lang.includes('en')
            ) || null;
        };

        // Handle voice list loading
        if (this.speechSynthesis.onvoiceschanged !== undefined) {
            this.speechSynthesis.onvoiceschanged = voicesChanged;
        }

        // Initial load
        voicesChanged();
    }

    public setAssistantName(name: string): void {
        this.assistantName = name || "StellarForge";

        // Update the QA map with the new name
        this.updateQAMapWithName();
    }

    private updateQAMapWithName(): void {
        // Update any responses that reference the assistant name
        this.qaMap.forEach(item => {
            item.responses = item.responses.map(response =>
                response.replace(/\${this\.assistantName}/g, this.assistantName)
            );
        });
    }

    public speak(text: string): void {
        if (!this.speechSynthesis || !this.isActive) return;
        this.cancel();
        this.storeResponse(text);
        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice
        if (this.preferredVoice) {
            utterance.voice = this.preferredVoice;
        }

        // Configure speech parameters to sound more like Iron Man's AI
        utterance.rate = 1.1; // Slightly faster
        utterance.pitch = 1.1; // Slightly higher
        utterance.volume = 1.0;

        // Handle speech events
        this.isSpeaking = true;
        this.lastInteractionTime = Date.now();

        utterance.onend = () => {
            this.isSpeaking = false;

            // Only proceed with callbacks if we're still active
            if (!this.isActive) {
                return;
            }

            // Call the callback if provided
            if (this.onSpeechEndCallback) {
                this.onSpeechEndCallback();
            }

            // Auto-start listening after speaking (if user has interacted before)
            // But only if we're still active and haven't completed interaction
            if (this.isActive && !this.interactionCompleted && this.responseHistory.length > 1) {
                this.startListeningWithDelay(300);
            }
        };

        utterance.onerror = () => {
            this.isSpeaking = false;
        };

        // Speak
        this.speechSynthesis.speak(utterance);
    }

    public cancel(): void {
        if (this.speechSynthesis && this.isSpeaking) {
            this.speechSynthesis.cancel();
            this.isSpeaking = false;
        }

        if (this.isListening) {
            this.stopListening();
        }
    }

    public startListeningWithDelay(delayMs: number = 0): void {
        if (!this.isActive || this.interactionCompleted) return;

        setTimeout(() => {
            this.startListening();
        }, delayMs);
    }

    public startListening(): void {
        if (!this.speechRecognition || this.isListening || this.isSpeaking || !this.isActive || this.interactionCompleted) return;

        try {
            this.speechRecognition.start();
            this.isListening = true;
            console.log('Speech recognition started');
        } catch (error) {
            console.error('Error starting speech recognition', error);
            this.isListening = false;

            // Try to restart after a brief delay if there was an error
            setTimeout(() => {
                if (this.isActive && !this.interactionCompleted) {
                    this.startListening();
                }
            }, 500);
        }
    }

    public stopListening(): void {
        if (!this.speechRecognition || !this.isListening) return;

        try {
            this.speechRecognition.stop();
            this.isListening = false;
        } catch (error) {
            console.error('Error stopping speech recognition', error);
        }
    }

    public onSpeechEnd(callback: () => void): void {
        this.onSpeechEndCallback = callback;
    }

    public onUserResponse(callback: (response: string) => void): void {
        this.onUserResponseCallback = callback;
    }

    public setContactFormCallback(callback: ContactFormCallback): void {
        this.contactFormCallback = callback;
    }

    public getReminder(): string {
        return "If you'd like me to power down, just say 'stop' or another shutdown command.";
    }

    public setActive(active: boolean): void {
        // If status is not changing, do nothing
        if (this.isActive === active) return;
        
        console.log(`Assistant active state changing: ${this.isActive} -> ${active}`);
        this.isActive = active;

        if (active) {
            // Reset flags and counters when activated
            this.interactionCompleted = false;
            this.recognitionRetryCount = 0;
            this.lastProcessedCommand = '';
            this.lastCommandTime = 0;
        } else {
            // Immediately cancel everything when deactivated
            this.cancel();
            this.interactionCompleted = true; // Mark as completed to prevent auto-restart
        }
    }

    public getGreeting(): string {
        // Reset interaction state
        this.interactionCompleted = false;
        this.recognitionRetryCount = 0;

        const hour = new Date().getHours();
        const currentTime = Date.now();
        const timeSinceLastInteraction = currentTime - this.lastInteractionTime;

        // If this is a repeat interaction within 2 minutes, use a different greeting
        if (timeSinceLastInteraction < 2 * 60 * 1000 && timeSinceLastInteraction > 10000) {
            return this.getReturnVisitorGreeting();
        }

        let greeting = "";

        if (hour < 12) {
            greeting = "Good morning";
        } else if (hour < 18) {
            greeting = "Good afternoon";
        } else {
            greeting = "Good evening";
        }

        // Reset contact asking state for new interactions
        this.hasAskedAboutContact = false;

        const greetings = [
            `${greeting}. Arc reactor online. I am ${this.assistantName}, your personal AI assistant. Would you like to contact Rishi?`,
            `${greeting}. ${this.assistantName} systems initialized. I'm here to assist with Rishi's portfolio. Would you like to get in touch with Rishi?`,
            `${greeting}. ${this.assistantName} at your service. Would you like me to help you contact Rishi?`
        ];

        // Set flag that we've asked about contact
        this.hasAskedAboutContact = true;

        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    private getReturnVisitorGreeting(): string {
        // Reset contact asking state for return visitors
        this.hasAskedAboutContact = false;

        const returnGreetings = [
            `Welcome back. ${this.assistantName} still at your service. Would you like to contact Rishi?`,
            `Hello again. ${this.assistantName} systems ready to assist you. Would you like to get in touch with Rishi?`,
            `I see you've returned. Would you like me to help you contact Rishi?`,
            `Arc reactor power levels stable. Would you like to connect with Rishi?`
        ];

        // Set flag that we've asked about contact
        this.hasAskedAboutContact = true;

        return returnGreetings[Math.floor(Math.random() * returnGreetings.length)];
    }

    private checkForYesResponse(input: string): boolean {
        const lowercaseInput = input.toLowerCase().trim();
        return lowercaseInput === 'yes' ||
            lowercaseInput === 'yeah' ||
            lowercaseInput === 'sure' ||
            lowercaseInput === 'ok' ||
            lowercaseInput === 'okay' ||
            lowercaseInput === 'yep' ||
            lowercaseInput === 'yup' ||
            lowercaseInput === 'absolutely' ||
            lowercaseInput === 'please' ||
            lowercaseInput === 'i do' ||
            lowercaseInput.includes('yes please') ||
            lowercaseInput.includes('yeah i would') ||
            lowercaseInput.includes('i want to') ||
            lowercaseInput.includes('i\'d like to');
    }

    private checkForNoResponse(input: string): boolean {
        const lowercaseInput = input.toLowerCase().trim();
        return lowercaseInput === 'no' ||
            lowercaseInput === 'nope' ||
            lowercaseInput === 'not now' ||
            lowercaseInput === 'no thanks' ||
            lowercaseInput === 'later' ||
            lowercaseInput === 'not yet' ||
            lowercaseInput.includes('don\'t want') ||
            lowercaseInput.includes('not right now') ||
            lowercaseInput.includes('i don\'t need') ||
            lowercaseInput.includes('no i don\'t');
    }

    public processInput(input: string): string {
        if (!this.isActive) return "";

        const lowercaseInput = input.toLowerCase();

        // Extract key terms for a more natural experience
        const terms = this.extractKeyTerms(lowercaseInput);

        // Check for stop commands first
        if (terms.some(term => ['stop', 'shut', 'down', 'power', 'off', 'bye', 'goodbye', 'exit', 'end'].includes(term))) {
            this.stopListening();
            this.interactionCompleted = true; // Mark as completed to prevent auto-restart
            return this.getRandomResponseFromPatterns(['stop']);
        }

        // Check for explicit contact requests
        if (terms.some(term => ['contact', 'touch', 'reach', 'email', 'hire', 'connect', 'message'].includes(term))) {
            if (this.contactFormCallback) {
                this.userWantsContact = true;
                this.interactionCompleted = true; // Mark as completed
                // Call the callback after responding
                setTimeout(() => {
                    if (this.contactFormCallback && this.isActive) {
                        this.contactFormCallback!();
                    }
                }, 500);
                return "I'll open the contact form for you right away.";
            } else {
                return "You can contact Rishi through the contact section of this portfolio.";
            }
        }

        // Match against our QA patterns
        for (const term of terms) {
            // Check each QA item for matching patterns
            for (const qaItem of this.qaMap) {
                if (qaItem.patterns.some(pattern => pattern.includes(term))) {
                    return qaItem.responses[Math.floor(Math.random() * qaItem.responses.length)];
                }
            }
        }

        // Try a more direct match with the full text
        for (const qaItem of this.qaMap) {
            for (const pattern of qaItem.patterns) {
                if (lowercaseInput.includes(pattern)) {
                    // Get a random response from the matching patterns
                    return qaItem.responses[Math.floor(Math.random() * qaItem.responses.length)];
                }
            }
        }

        // Default response if no match found
        return "I'm not sure I understand. You can ask me about Rishi, his skills, projects, or if you'd like to contact him.";
    }

    private extractKeyTerms(input: string): string[] {
        // List of terms to extract
        const keyTerms = [
            // About Rishi
            'rishi', 'developer', 'creator', 'portfolio', 'about',
            // Skills
            'skill', 'tech', 'technology', 'programming', 'framework', 'language',
            // Projects
            'project', 'work', 'built', 'app', 'website', 'application',
            // Contact
            'contact', 'hire', 'touch', 'email', 'reach',
            // About AI
            'who', 'what', 'yourself', 'name', 'speaking', 'talking', 'are you',
            // Commands
            'stop', 'shut', 'down', 'power', 'off', 'goodbye', 'bye', 'exit'
        ];

        const words = input.toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove punctuation
            .split(/\s+/); // Split by whitespace

        // Extract all matching terms
        return keyTerms.filter(term =>
            words.some(word => word === term || word.includes(term))
        );
    }

    private getRandomResponseFromPatterns(patterns: string[]): string {
        // Find matching QA items
        const matchingQAItems = this.qaMap.filter(qaItem =>
            qaItem.patterns.some(pattern => patterns.includes(pattern))
        );

        if (matchingQAItems.length > 0) {
            // Get a random QA item from matches
            const qaItem = matchingQAItems[Math.floor(Math.random() * matchingQAItems.length)];
            // Get a random response from that item
            return qaItem.responses[Math.floor(Math.random() * qaItem.responses.length)];
        }

        // Fallback if no match found
        return "I understand. Let me know if you need anything else.";
    }

    private storeResponse(text: string, isFromUser: boolean = false): void {
        this.responseHistory.push({
            text,
            timestamp: Date.now(),
            isFromUser
        });

        // Limit history to last 20 responses
        if (this.responseHistory.length > 20) {
            this.responseHistory = this.responseHistory.slice(-20);
        }

        // Persist to localStorage
        this.saveHistoryToStorage();
    }

    private saveHistoryToStorage(): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('aiAssistantHistory', JSON.stringify(this.responseHistory));
        }
    }

    private loadHistoryFromStorage(): void {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('aiAssistantHistory');
            if (saved) {
                try {
                    this.responseHistory = JSON.parse(saved);
                } catch (e) {
                    console.error('Error parsing saved conversation history', e);
                    this.responseHistory = [];
                }
            }
        }
    }

    public getResponseHistory(): AIAssistantResponse[] {
        return [...this.responseHistory];
    }

    public clearHistory(): void {
        this.responseHistory = [];
        if (typeof window !== 'undefined') {
            localStorage.removeItem('aiAssistantHistory');
        }
    }

    public isReady(): boolean {
        return !!this.speechSynthesis && !!this.preferredVoice;
    }

    public isSpeakingNow(): boolean {
        return this.isSpeaking;
    }

    public isListeningNow(): boolean {
        return this.isListening;
    }
}

export default AIAssistant; 