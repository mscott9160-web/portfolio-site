"use client";

import { useEffect, useId, useState } from "react";

type MermaidDiagramProps = {
  chart: string;
  label: string;
};

export default function MermaidDiagram({ chart, label }: MermaidDiagramProps) {
  const generatedId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let active = true;

    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: {
          background: "#f4f5f1",
          primaryColor: "#cbdcff",
          primaryTextColor: "#122034",
          primaryBorderColor: "#1749d1",
          lineColor: "#687386",
          secondaryColor: "#e0e8f8",
          tertiaryColor: "#ffffff",
          noteBkgColor: "#fff7d6",
          noteTextColor: "#122034",
        },
      });

      mermaid.render(`mermaid-${generatedId}`, chart).then(({ svg: renderedSvg }) => {
        if (active) setSvg(renderedSvg);
      });
    });

    return () => {
      active = false;
    };
  }, [chart, generatedId]);

  return (
    <div className="diagram-frame" aria-label={label}>
      {svg ? <div className="diagram-svg" dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="diagram-loading" aria-hidden="true" />}
    </div>
  );
}
