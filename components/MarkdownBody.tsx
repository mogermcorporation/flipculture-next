import ReactMarkdown from "react-markdown";

export default function MarkdownBody({ markdown }: { markdown: string }) {
  return (
    <div className="journal-prose">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-xl font-black mt-8 mb-3 text-white">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mt-6 mb-2 text-white">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-neutral-300 text-sm leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 text-neutral-300 text-sm space-y-2 mb-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 text-neutral-300 text-sm space-y-2 mb-4">{children}</ol>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-purple-300 underline underline-offset-4">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
