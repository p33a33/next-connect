import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef } from "react";
import SocketIOClient, { Socket } from "socket.io-client";
import { SocketMessageType } from "../../server/socketMessageType";
import styles from "../../styles/Home.module.css";

export default function Chat() {
  const io = useRef<Socket | null>(null);
  const nicknameInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const ioClient = SocketIOClient();
    io.current = ioClient;

    ioClient.on(SocketMessageType.NEW_USER, console.log);
    ioClient.on(SocketMessageType.USER_OUT, console.log);

    return () => {
      ioClient.disconnect();
    };
  }, []);

  return (
    <div className={styles.container}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const nicknameValue = nicknameInput.current?.value.trim() ?? "";

          if (nicknameValue.length < 4) return alert("must longer than 4 char");

          if (io.current) {
            io.current.emit(SocketMessageType.NEW_USER, nicknameValue);
          }
        }}
      >
        <input placeholder="nickname" ref={nicknameInput} />
        <button>Submit</button>
      </form>

      <button
        onClick={() => {
          console.log(io.current?.connect());
        }}
      >
        log io
      </button>
    </div>
  );
}
