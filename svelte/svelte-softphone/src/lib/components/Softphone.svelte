<script>
    import { onMount, onDestroy } from "svelte";
    import { UserAgent, UserAgentState, Inviter } from "sip.js";

    /**
     * @typedef {"connecting" | "connected" | "disconnected" | "failed"} ConnectionStatus
     */

    /**
     * @typedef {"idle" | "calling" | "connected"} CallStatus
     */

    /**
     * @typedef {Object} SipCredentials
     * @property {string} uri - The SIP URI (e.g., sip:user@domain.com)
     * @property {string} password - The SIP password
     * @property {string} websocketServer - The WebSocket server URL
     */

    /** @type {SipCredentials} */
    let sipCredentials = {
        uri: "",
        password: "",
        websocketServer: "",
    };

    /** @type {ConnectionStatus} */
    let connectionStatus = "disconnected";
    
    /** @type {boolean} */
    let isRegistered = false;
    
    /** @type {import("sip.js").Inviter | null} */
    let currentSession = null;
    
    /** @type {CallStatus} */
    let callStatus = "idle";
    
    /** @type {string} */
    let phoneNumber = "";
    
    /** @type {import("sip.js").UserAgent | null} */
    let userAgent = null;
    
    /** @type {string | null} */
    let errorMessage = null;

    /**
     * Sets an error message and logs it to console
     * @param {string} message
     */
    function setError(message) {
        errorMessage = message;
        console.error(message);
    }

    /**
     * Clears the current error message
     */
    function clearError() {
        errorMessage = null;
    }

    /**
     * Initializes the SIP connection with the provided credentials
     */
    async function initializeSIP() {
        try {
            if (!sipCredentials.uri || !sipCredentials.password || !sipCredentials.websocketServer) {
                setError('All fields are required');
                return;
            }

            if (userAgent) {
                await userAgent.stop();
                userAgent = null;
            }

            connectionStatus = "connecting";
            clearError();

            const uri = UserAgent.makeURI(sipCredentials.uri);
            if (!uri) {
                throw new Error("Failed to create URI from provided SIP URI");
            }

            userAgent = new UserAgent({
                uri,
                authorizationPassword: sipCredentials.password,
                transportOptions: {
                    server: sipCredentials.websocketServer
                },
                sessionDescriptionHandlerFactoryOptions: {
                    peerConnectionConfiguration: {
                        iceServers: [
                            { urls: "stun:stun.l.google.com:19302" }
                        ]
                    }
                }
            });

            userAgent.delegate = {
                onConnect: () => {
                    console.log("Connected to WebSocket");
                    userAgent?.start();
                },
                onDisconnect: () => {
                    console.log("Disconnected from WebSocket");
                    connectionStatus = "disconnected";
                    isRegistered = false;
                }
            };

            userAgent.stateChange.addListener((state) => {
                console.log("UserAgent state changed to:", state);
                switch (state) {
                    case UserAgentState.Started:
                        isRegistered = true;
                        connectionStatus = "connected";
                        clearError();
                        break;
                    case UserAgentState.Stopped:
                        isRegistered = false;
                        connectionStatus = "disconnected";
                        break;
                }
            });

            await userAgent.start();

        } catch (error) {
            setError('Failed to initialize SIP connection: ' + (error instanceof Error ? error.message : String(error)));
            connectionStatus = "failed";
        }
    }

    /**
     * Initiates an outbound call to the specified phone number
     */
    async function makeCall() {
        try {
            if (!userAgent || !isRegistered) {
                setError('Cannot make call: Not registered with SIP server');
                return;
            }

            if (!phoneNumber) {
                setError('Please enter a phone number');
                return;
            }

            clearError();

            const domain = sipCredentials.uri.split('@')[1]?.split('>')[0];
            if (!domain) {
                throw new Error("Could not extract domain from SIP URI");
            }

            const targetUri = `sip:${phoneNumber}@${domain}`;
            console.log("Attempting to call:", targetUri);

            const target = UserAgent.makeURI(targetUri);
            if (!target) {
                throw new Error("Failed to create target URI");
            }

            const inviter = new Inviter(userAgent, target, {
                sessionDescriptionHandlerOptions: {
                    constraints: { audio: true, video: false }
                }
            });

            currentSession = inviter;
            callStatus = "calling";

            inviter.stateChange.addListener((state) => {
                console.log("Call state:", state);
                switch (state) {
                    case "Establishing":
                        callStatus = "calling";
                        break;
                    case "Established":
                        callStatus = "connected";
                        break;
                    case "Terminated":
                        callStatus = "idle";
                        currentSession = null;
                        break;
                }
            });

            await inviter.invite();

        } catch (err) {
            setError('Error making call: ' + (err instanceof Error ? err.message : String(err)));
            callStatus = "idle";
            currentSession = null;
        }
    }

    /**
     * Ends the current call
     */
    async function hangupCall() {
        try {
            if (currentSession) {
                await currentSession.dispose();
                currentSession = null;
                callStatus = "idle";
            }
        } catch (err) {
            setError('Error hanging up: ' + (err instanceof Error ? err.message : String(err)));
        }
    }

    /**
     * Disconnects from the SIP server and cleans up
     */
    async function disconnect() {
        try {
            if (userAgent) {
                await userAgent.stop();
                userAgent = null;
            }
            isRegistered = false;
            callStatus = "idle";
            currentSession = null;
            connectionStatus = "disconnected";
        } catch (err) {
            setError('Error disconnecting: ' + (err instanceof Error ? err.message : String(err)));
        }
    }

    onDestroy(() => {
        disconnect();
    });
</script>

<div class="softphone">
    <h2>SIP Softphone</h2>

    {#if errorMessage}
        <div class="error-message">
            {errorMessage}
            <button class="close-error" on:click={clearError}>×</button>
        </div>
    {/if}

    {#if !isRegistered}
        <div class="credentials-form">
            <h3>SIP Credentials</h3>
            <input
                type="text"
                placeholder="SIP URI (sip:user@domain.com)"
                bind:value={sipCredentials.uri}
            />
            <input
                type="password"
                placeholder="Password"
                bind:value={sipCredentials.password}
            />
            <input
                type="text"
                placeholder="WebSocket Server (wss://server:port)"
                bind:value={sipCredentials.websocketServer}
            />
            <button on:click={initializeSIP}>
                {connectionStatus === "connecting" ? "Connecting..." : "Connect"}
            </button>
        </div>
    {:else}
        <div class="phone-interface">
            <div class="status">
                <div>Status: {connectionStatus}</div>
                <button on:click={disconnect}>Logout</button>
            </div>

            <div class="call-controls">
                <input
                    type="text"
                    placeholder="Phone number"
                    bind:value={phoneNumber}
                    disabled={callStatus !== "idle"}
                />

                {#if callStatus === "idle"}
                    <button on:click={makeCall}>Call</button>
                {:else}
                    <button on:click={hangupCall}>Hang Up</button>
                {/if}

                <div class="call-status">
                    Call Status: {callStatus}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .softphone {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .credentials-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    button {
        padding: 8px;
        border: none;
        border-radius: 4px;
        background: #007bff;
        color: white;
        cursor: pointer;
    }

    button:disabled {
        background: #ccc;
    }

    .error-message {
        background: #fee;
        border: 1px solid #faa;
        color: #900;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        position: relative;
    }

    .close-error {
        position: absolute;
        right: 5px;
        top: 5px;
        background: none;
        border: none;
        color: #900;
        cursor: pointer;
    }

    .phone-interface {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .status {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .call-controls {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .call-status {
        text-align: center;
        padding: 10px;
        background: #f5f5f5;
        border-radius: 4px;
    }
</style>
