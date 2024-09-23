// MarketingAgreement.tsx (마케팅 및 알림 수신 동의)
import React from "react";
import ReactMarkdown from "react-markdown";

const markdownContent = `
# 마케팅 및 알림 수신 동의
- 신작, 인기, 추천 콘텐츠 안내 및 이벤트, 마케팅 및 프로모션 정보 안내 등을 주 목적으로 하며 수신 동의 시 메일 알림에 수신 동의 처리 됩니다.
- 동의하지 않으셔도 서비스 이용이 가능하며 동의하신 이후에도 정보 수신 시 안내에 따라 수신 동의를 철회할 수 있습니다.
- 서비스 이용기록과 접속 빈도 분석, 서비스 이용에 대한 통계, 서비스 분석 및 통계에 따른 맞춤 서비스 제공 및 광고 게재 등에 개인정보를 이용합니다.
`;

const MarketingAgreement: React.FC = () => {
  return (
    <div className="container mx-auto p-4 mt-20">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold my-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-semibold my-4" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-semibold my-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-base my-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="list-disc ml-6" {...props} />
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarketingAgreement;
