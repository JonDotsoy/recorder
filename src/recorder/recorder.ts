import { recordingState } from "../components/recordingState";
import {  recording } from "./db";

export type RecordingControl = ReturnType<typeof createRecordingControl>;

export const createRecordingControl = () => {
    const stopped = Promise.withResolvers<'stopped' | 'aborted'>();

    return {
        stopped: stopped.promise,
        stop: () => {
            stopped.resolve('stopped');
        },
        abort: () => {
            stopped.resolve('aborted');
        }
    }
}

export async function startScreenRecording() {

    // Solicitar acceso para capturar la pantalla
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
    });

    // Crear un MediaRecorder para grabar el stream
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    // Escuchar eventos de datos disponibles
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    // Escuchar cuando la grabación se detiene
    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Crear un enlace para descargar la grabación
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screen-recording.webm';
        a.click();

        // Liberar el stream
        stream.getTracks().forEach((track) => track.stop());
    };

    // Iniciar la grabación
    mediaRecorder.start();
    console.log('Recording started');

    // Detener la grabación después de 10 segundos (puedes cambiar esto)
    setTimeout(() => {
        mediaRecorder.stop();
        console.log('Recording stopped');
    }, 10000);
}

export async function startScreenRecordingWithAudio(recordingControl: RecordingControl) {
    const startDate = new Date();

    // Solicitar acceso para capturar la pantalla y el audio del micrófono
    const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
    });
    const userMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
    });

    console.log("Recording with audio started");

    recordingState.set(true);

    // Crear un MediaRecorder para grabar el stream combinado
    const displayMediaRecorder = new MediaRecorder(displayMediaStream);
    const userMediaRecorder = new MediaRecorder(userMediaStream);
    const displayMediaChunks: Blob[] = [];
    const userMediaChunks: Blob[] = [];

    // Escuchar eventos de datos disponibles
    displayMediaRecorder.ondataavailable = (event) => {
        console.log('displayMediaRecorder.ondataavailable', event.data.size);
        if (event.data.size > 0) {
            displayMediaChunks.push(event.data);
        }
    };
    userMediaRecorder.ondataavailable = (event) => {
        console.log('userMediaRecorder.ondataavailable', event.data.size);
        if (event.data.size > 0) {
            userMediaChunks.push(event.data);
        }
    };

    // Iniciar la grabación
    displayMediaRecorder.start();
    userMediaRecorder.start();
    console.log('Recording with audio started');

    const status = await recordingControl.stopped;

    if (status === 'aborted') {
        console.log('Recording aborted');
        displayMediaRecorder.stream.getTracks().forEach((track) => track.stop());
        userMediaRecorder.stream.getTracks().forEach((track) => track.stop());
        return;
    }

    await Promise.all([
        new Promise<void>(resolve => {
            displayMediaRecorder.onstop = () => { resolve() };
            displayMediaRecorder.stop();
        }),
        new Promise<void>(resolve => {
            userMediaRecorder.onstop = () => { resolve() };
            userMediaRecorder.stop();
        }),
    ])

    await recording.create({
        key: `${startDate.toISOString()}-displaymedia.webm`,
        timestamp: startDate.getTime(),
        data: new Blob(displayMediaChunks, { type: 'video/webm' }),
    })

    await recording.create({
        key: `${startDate.toISOString()}-usermedia.webm`,
        timestamp: startDate.getTime(),
        data: new Blob(userMediaChunks, { type: 'video/webm' }),
    })

    // const displayMediaBlob = new Blob(displayMediaChunks, { type: 'video/webm' });
    // const displayMediaUrl = URL.createObjectURL(displayMediaBlob);

    // // Crear un enlace para descargar la grabación
    // const displayMediaAnchor = document.createElement('a');
    // displayMediaAnchor.href = displayMediaUrl;
    // displayMediaAnchor.download = `${new Date().toISOString()}-recording1.webm`;
    // displayMediaAnchor.click();

    // const userMediaBlob = new Blob(userMediaChunks, { type: 'video/webm' });
    // const userMediaUrl = URL.createObjectURL(userMediaBlob);

    // // Crear un enlace para descargar la grabación
    // const userMediaAnchor = document.createElement('a');
    // userMediaAnchor.href = userMediaUrl;
    // userMediaAnchor.download = `${new Date().toISOString()}-recording2.webm`;
    // userMediaAnchor.click();


    // (document.getElementById("r1") as HTMLVideoElement).src = displayMediaUrl;
    // (document.getElementById("r2") as HTMLVideoElement).src = userMediaUrl;


    // Liberar los streams
    displayMediaStream.getTracks().forEach((track) => track.stop());
    userMediaStream.getTracks().forEach((track) => track.stop());
    recordingState.set(false);
}
