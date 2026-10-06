import { C, FONT } from "../theme";

// Mention légale obligatoire en France (ANJ) sur toute communication liée aux paris
export const Mention: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 60,
      left: 40,
      right: 40,
      fontFamily: FONT,
      fontSize: 30,
      color: C.texteDoux,
      textAlign: "center",
      lineHeight: 1.3,
    }}
  >
    🔞 Interdit aux mineurs · Jouer comporte des risques : endettement, isolement, dépendance.
    Pour être aidé, appelez le 09 74 75 13 13 (appel non surtaxé)
  </div>
);
