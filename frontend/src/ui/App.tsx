



// // import { useState } from "react";

// // declare global {
// //   interface Window {
// //     electronAPI: {
// //       getPublicKey: () => Promise<string>;
// //     };
// //   }
// // }

// // export default function RegisterPage() {
// //   const [username, setUsername] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [status, setStatus] = useState("");

// //   const handleRegister = async () => {
// //     // 1. Get public key from Electron
// //     const publicKey = await window.electronAPI.getPublicKey();

// //     // 2. Prepare payload
// //     const payload = {
// //       username,
// //       email,
// //       password,
// //       publicKey
// //     };

// //     console.log("Register payload:", payload);

// //     // 3. Send to backend (example)
// //     // fetch("http://localhost:3000/register", {
// //     //   method: "POST",
// //     //   headers: { "Content-Type": "application/json" },
// //     //   body: JSON.stringify(payload)
// //     // });

// //     setStatus("Payload logged to console");
// //   };

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h2 className="text-5xl">Register</h2>
// //       <input
// //         placeholder="Username"
// //         value={username}
// //         onChange={e => setUsername(e.target.value)}
// //       /><br/>
// //       <input
// //         placeholder="Email"
// //         value={email}
// //         onChange={e => setEmail(e.target.value)}
// //       /><br/>
// //       <input
// //         type="password"
// //         placeholder="Password"
// //         value={password}
// //         onChange={e => setPassword(e.target.value)}
// //       /><br/><br/>
// //       <button onClick={handleRegister}>Register</button>
// //       <p>{status}</p>
// //     </div>
// //   );
// // }


// import { useState } from "react";

// declare global {
//   interface Window {
//     electronAPI: {
//       getPublicKey: () => Promise<string>;
//     };
//   }
// }

// export default function RegisterPage() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [status, setStatus] = useState("");

//   const handleRegister = async () => {
//     const publicKey = await window.electronAPI.getPublicKey();
//     const payload = { username, email, password, publicKey };
//     console.log("Register payload:", payload);
//     setStatus("Payload logged to console");
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 font-sans">
//       <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
//         <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Cipher Register</h2>

//         <input
//           className="w-full mb-4 px-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <input
//           className="w-full mb-4 px-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           className="w-full mb-6 px-4 py-3 bg-gray-900 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-gray-900 font-bold rounded-md shadow-md hover:shadow-lg transition duration-200"
//           onClick={handleRegister}
//         >
//           Register
//         </button>

//         {status && (
//           <p className="mt-4 text-center text-gray-400 text-sm italic">{status}</p>
//         )}
//       </div>

//       <p className="mt-6 text-gray-500 text-sm">
//         By registering, your public key will be attached automatically.
//       </p>
//     </div>
//   );
// }


import { useState } from "react";

declare global {
  interface Window {
    electronAPI: {
      getPublicKey: () => Promise<string>;
    };
  }
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleRegister = async () => {
    const publicKey = await window.electronAPI.getPublicKey();
    const payload = { username, email, password, publicKey };
    console.log("Register payload:", payload);
    setStatus("Payload logged to console");
  };

  return (
    <div className="min-h-screen min-w-screen w-full flex flex-col items-center justify-center bg-black text-white font-sans">
      <div className="w-full max-w-lg p-10 bg-gray-900 rounded-xl shadow-xl border border-gray-700">
        <h2 className="text-4xl font-bold mb-8 text-center">CIPHER REGISTER</h2>

        <input
          className="w-full mb-6 px-5 py-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full mb-6 px-5 py-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-8 px-5 py-4 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full py-4 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white font-bold rounded-md shadow-lg transition duration-200"
          onClick={handleRegister}
        >
          REGISTER
        </button>

        {status && (
          <p className="mt-6 text-center text-gray-400 text-sm italic">{status}</p>
        )}
      </div>

      <p className="mt-10 text-gray-500 text-sm">
        Your public key will be automatically attached to the registration payload.
      </p>
    </div>
  );
}