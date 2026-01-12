<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { createUserAgent, register, makeCall, onIncomingCall } from '$lib/sipClient';
    import { SessionState } from 'sip.js';
    import type { Invitation, Session, UserAgent } from 'sip.js';

    let target = '';
    let session: Session | null = null;
    let remoteAudio: HTMLAudioElement;
    let userAgentInstance: UserAgent | null = null;
    let error: string | null = null;
    let isConnected = false;

    onMount(async () => {
        try {
            const { userAgent } = createUserAgent({
                uri: import.meta.env.VITE_SIP_URI || "sip:u0406200105@sip.telavox.se",
                transportOptions: {
                    server: import.meta.env.VITE_SIP_SERVER || "wss://sipproxy8.telavox.se/"
                },
                authorizationUsername: import.meta.env.VITE_SIP_USERNAME || "u0406200105",
                authorizationPassword: import.meta.env.VITE_SIP_PASSWORD || "4qS1ibq3wc"
            });

            userAgentInstance = userAgent;
            await userAgent.start();
            await register();
            isConnected = true;
            error = null;

            onIncomingCall((invitation: Invitation) => {
                try {
                    session = invitation;
                    invitation.accept().then(() => {
                        if (session) {
                            attachRemoteAudio(session);
                        }
                    }).catch((err) => {
                        error = `Failed to accept call: ${err.message}`;
                    });
                } catch (err) {
                    error = `Error handling incoming call: ${err instanceof Error ? err.message : String(err)}`;
                }
            });
        } catch (err) {
            error = `Connection failed: ${err instanceof Error ? err.message : String(err)}`;
            isConnected = false;
        }
    });

    async function call() {
        try {
            if (!target) {
                error = "Please enter a number to call";
                return;
            }
            error = null;
            const inviteRequest = await makeCall(`sip:${target}@sip.telavox.se`);
            session = inviteRequest as unknown as Session;

            // Wait a bit for the session to be established
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (session?.sessionDescriptionHandler) {
                await attachRemoteAudio(session);
            } else {
                throw new Error("No session description handler available");
            }
        } catch (err) {
            error = `Call failed: ${err instanceof Error ? err.message : String(err)}`;
        }
    }

    function hangup() {
        try {
            if (session) {
                if (session.state === SessionState.Established) {
                    session.bye();
                } else {
                    (session as any).cancel?.();
                }
                session = null;
            }
        } catch (err) {
            error = `Hangup failed: ${err instanceof Error ? err.message : String(err)}`;
        }
    }

    function attachRemoteAudio(session: Session) {
        if (!session?.sessionDescriptionHandler) {
            throw new Error("No session description handler available");
        }

        const handler = session.sessionDescriptionHandler as unknown as { peerConnection: RTCPeerConnection };
        
        if (!handler?.peerConnection) {
            throw new Error("No peer connection available");
        }

        // Set up audio element
        remoteAudio.autoplay = true;
        (remoteAudio as any).playsInline = true;
        remoteAudio.volume = 1;

        // Create a new MediaStream for all audio tracks
        const audioStream = new MediaStream();

        handler.peerConnection.getReceivers().forEach((receiver: RTCRtpReceiver) => {
            if (receiver.track?.kind === 'audio') {
                console.log('Adding audio track to stream:', receiver.track);
                audioStream.addTrack(receiver.track);
            }
        });

        if (audioStream.getTracks().length === 0) {
            console.warn('No audio tracks found in the session');
            return;
        }

        // Attach the stream to the audio element
        remoteAudio.srcObject = audioStream;

        // Ensure audio starts playing
        const playPromise = remoteAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.error('Audio playback failed:', err);
                error = `Failed to play audio: ${err.message}. Try clicking somewhere on the page.`;
            });
        }

        // Log the audio state
        console.log('Audio element state:', {
            readyState: remoteAudio.readyState,
            paused: remoteAudio.paused,
            currentTime: remoteAudio.currentTime,
            srcObject: remoteAudio.srcObject ? 'set' : 'not set',
            volume: remoteAudio.volume,
            muted: remoteAudio.muted
        });
    }

    onDestroy(() => {
        try {
            if (session) {
                if (session.state === SessionState.Established) {
                    session.bye();
                } else {
                    (session as any).cancel?.();
                }
            }
            if (userAgentInstance) {
                userAgentInstance.stop();
            }
        } catch (err) {
            console.error("Cleanup failed:", err);
        }
    });
</script>

{#if error}
    <div class="error">
        {error}
        <button on:click={() => error = null}>×</button>
    </div>
{/if}

<div class="status">
    Connection status: {isConnected ? 'Connected' : 'Disconnected'}
</div>

<input 
    bind:value={target} 
    placeholder="Enter number" 
    disabled={!isConnected || !!session}
/>
<button 
    on:click={call} 
    disabled={!isConnected || !!session || !target}
>
    Call
</button>
<button 
    on:click={hangup} 
    disabled={!session}
>
    Hangup
</button>
<audio 
    bind:this={remoteAudio}
    autoplay 
    playsinline
></audio>

<style>
    .error {
        background: #fee;
        border: 1px solid #faa;
        padding: 0.5em;
        margin: 0.5em 0;
        position: relative;
    }

    .error button {
        position: absolute;
        right: 0.5em;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
    }

    .status {
        margin: 1em 0;
    }

    input:disabled, button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
