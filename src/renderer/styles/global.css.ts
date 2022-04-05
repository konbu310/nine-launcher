import { globalStyle } from "@vanilla-extract/css";

globalStyle("*", {
  boxSizing: "border-box",
  fontFamily: "sans-serif",
});

globalStyle("html", {
  fontSize: "calc(112.5% + 0.25vw)",
});

globalStyle("body", {
  backgroundColor: "transparent",
  margin: 0,
  padding: 0,
});
