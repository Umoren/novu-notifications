import React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Link,
    Button,
    Hr,
    Img,
    Preview
} from '@react-email/components';

export default function NewsletterEmail({
    firstName = 'User',
    companyName = 'Your Company',
    articles = [],
    unsubscribeUrl = '#',
    webViewUrl = '#'
}) {
    const defaultArticles = [
        {
            title: "New Feature Release: Enhanced Dashboard",
            summary: "We've redesigned our dashboard to make it more intuitive and powerful.",
            readMoreUrl: "#",
            imageUrl: "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Article+Image"
        },
        {
            title: "Customer Success Story",
            summary: "See how Company X increased their productivity by 40% using our platform.",
            readMoreUrl: "#",
            imageUrl: "https://via.placeholder.com/400x200/E5E7EB/6B7280?text=Success+Story"
        }
    ];

    const content = articles.length > 0 ? articles : defaultArticles;

    return React.createElement(Html, null,
        React.createElement(Head),
        React.createElement(Preview, null, `Your weekly update from ${companyName}`),
        React.createElement(Body, { style: main },
            React.createElement(Container, { style: container },
                // Header
                React.createElement(Section, { style: header },
                    React.createElement(Img, {
                        src: "https://via.placeholder.com/150x50/4F46E5/white?text=LOGO",
                        width: "150",
                        height: "50",
                        alt: companyName,
                        style: logo
                    }),
                    React.createElement(Text, { style: headerText }, "Weekly Newsletter")
                ),

                // Web View
                React.createElement(Section, { style: webView },
                    React.createElement(Text, { style: webViewText },
                        "Can't see this email properly? ",
                        React.createElement(Link, { href: webViewUrl, style: link }, "View in browser")
                    )
                ),

                // Main Content
                React.createElement(Section, { style: contentSection },
                    React.createElement(Text, { style: greeting },
                        `Hi ${firstName}! 👋`
                    ),

                    React.createElement(Text, { style: paragraph },
                        "Welcome to this week's newsletter! Here are the latest updates, features, and stories we think you'll find interesting."
                    ),

                    React.createElement(Hr, { style: hr }),

                    // Articles
                    ...content.map((article, index) =>
                        React.createElement(Section, { key: index, style: articleSection },
                            React.createElement(Img, {
                                src: article.imageUrl,
                                width: "100%",
                                height: "200",
                                alt: article.title,
                                style: articleImage
                            }),
                            React.createElement(Text, { style: articleTitle }, article.title),
                            React.createElement(Text, { style: articleSummary }, article.summary),
                            React.createElement(Section, { style: buttonContainer },
                                React.createElement(Button, { href: article.readMoreUrl, style: button },
                                    "Read More"
                                )
                            ),
                            index < content.length - 1 ? React.createElement(Hr, { style: articleHr }) : null
                        )
                    ),

                    React.createElement(Hr, { style: hr }),

                    // CTA Section
                    React.createElement(Section, { style: ctaSection },
                        React.createElement(Text, { style: ctaHeading }, "Ready to get more done?"),
                        React.createElement(Text, { style: ctaParagraph },
                            "Upgrade to our Pro plan and unlock advanced features that will supercharge your workflow."
                        ),
                        React.createElement(Section, { style: buttonContainer },
                            React.createElement(Button, { href: "#", style: ctaButton },
                                "Upgrade Now"
                            )
                        )
                    )
                ),

                // Footer
                React.createElement(Section, { style: footer },
                    React.createElement(Text, { style: footerText },
                        `Thanks for being part of the ${companyName} community!`
                    ),
                    React.createElement(Text, { style: footerText },
                        React.createElement(Link, { href: unsubscribeUrl, style: unsubscribeLink }, "Unsubscribe"),
                        " | ",
                        React.createElement(Link, { href: "#", style: unsubscribeLink }, " Update Preferences")
                    ),
                    React.createElement(Text, { style: footerText },
                        `© 2025 ${companyName}. All rights reserved.`
                    )
                )
            )
        )
    );
}

// Styles remain the same...
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '580px',
};

const header = {
    padding: '24px 0',
    textAlign: 'center',
    backgroundColor: '#4F46E5',
    color: '#ffffff',
};

const logo = {
    margin: '0 auto 16px',
};

const headerText = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0',
};

const webView = {
    padding: '16px 24px',
    backgroundColor: '#f9fafb',
    textAlign: 'center',
};

const webViewText = {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0',
};

const contentSection = {
    padding: '0 48px',
};

const greeting = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#484848',
    margin: '24px 0 16px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#484848',
    margin: '16px 0',
};

const articleSection = {
    margin: '32px 0',
};

const articleImage = {
    borderRadius: '8px',
    margin: '0 0 16px',
};

const articleTitle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#484848',
    margin: '0 0 12px',
};

const articleSummary = {
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#6b7280',
    margin: '0 0 16px',
};

const buttonContainer = {
    textAlign: 'left',
    margin: '16px 0',
};

const button = {
    backgroundColor: '#4F46E5',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '10px 20px',
    border: 'none',
};

const ctaSection = {
    backgroundColor: '#f9fafb',
    padding: '32px 24px',
    borderRadius: '8px',
    textAlign: 'center',
    margin: '32px 0',
};

const ctaHeading = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#484848',
    margin: '0 0 16px',
};

const ctaParagraph = {
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#6b7280',
    margin: '0 0 24px',
};

const ctaButton = {
    backgroundColor: '#059669',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 32px',
    border: 'none',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '24px 0',
};

const articleHr = {
    borderColor: '#e6ebf1',
    margin: '32px 0',
};

const link = {
    color: '#4F46E5',
    textDecoration: 'underline',
};

const footer = {
    padding: '32px 48px 24px',
    textAlign: 'center',
    backgroundColor: '#f9fafb',
};

const footerText = {
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#9ca299',
    margin: '8px 0',
};

const unsubscribeLink = {
    color: '#9ca299',
    textDecoration: 'underline',
    fontSize: '12px',
    margin: '0 8px',
};