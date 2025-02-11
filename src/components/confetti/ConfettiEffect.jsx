import Confetti from "react-confetti";

export default function ConfettiEffect({ fadeOut }) {
  return (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        opacity: fadeOut ? 0 : 1,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        transition: "opacity 2s ease-out",
      }}
    />
  );
}
