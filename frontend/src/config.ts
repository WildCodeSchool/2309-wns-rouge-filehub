export const API_URL =
  typeof window !== "undefined" &&
  window.location.origin.includes("localhost") === false
    ? `${window.location.origin}/graphql`
    : "http://localhost:5001";
