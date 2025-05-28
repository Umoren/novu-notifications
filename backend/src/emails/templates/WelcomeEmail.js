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

export default function WelcomeEmail({
    firstName = 'User',
    companyName = 'Your Company',
    loginUrl = '#',
    supportEmail = 'support@company.com'
}) {
    return React.createElement(Html, null,
        React.createElement(Head),
        React.createElement(Preview, null, `Welcome to ${companyName}! Let's get you started.`),
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
                    })
                ),

                // Main Content
                React.createElement(Section, { style: content },
                    React.createElement(Text, { style: heading },
                        `Welcome to ${companyName}, ${firstName}! 🎉`
                    ),

                    React.createElement(Text, { style: paragraph },
                        "We're thrilled to have you on board! Your account has been successfully created, and you're ready to start exploring all the amazing features we have to offer."
                    ),

                    React.createElement(Section, { style: buttonContainer },
                        React.createElement(Button, { href: loginUrl, style: button },
                            "Get Started"
                        )
                    ),

                    React.createElement(Text, { style: paragraph },
                        "If you have any questions or need help getting started, don't hesitate to reach out to our support team at ",
                        React.createElement(Link, { href: `mailto:${supportEmail}`, style: link }, supportEmail),
                        "."
                    ),

                    React.createElement(Hr, { style: hr }),

                    React.createElement(Text, { style: paragraph },
                        React.createElement('strong', null, "What's next?")
                    ),
                    React.createElement(Text, { style: listItem }, "✅ Complete your profile"),
                    React.createElement(Text, { style: listItem }, "✅ Explore the dashboard"),
                    React.createElement(Text, { style: listItem }, "✅ Set up your preferences")
                ),

                // Footer
                React.createElement(Section, { style: footer },
                    React.createElement(Text, { style: footerText },
                        `Best regards,`,
                        React.createElement('br'),
                        `The ${companyName} Team`
                    ),
                    React.createElement(Text, { style: footerText },
                        `© 2025 ${companyName}. All rights reserved.`
                    )
                )
            )
        )
    );
}

// Styles
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
};

const logo = {
    margin: '0 auto',
};

const content = {
    padding: '0 48px',
};

const heading = {
    fontSize: '28px',
    lineHeight: '1.3',
    fontWeight: '700',
    color: '#484848',
    textAlign: 'center',
    margin: '0 0 24px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#484848',
    margin: '16px 0',
};

const listItem = {
    fontSize: '16px',
    lineHeight: '1.4',
    color: '#484848',
    margin: '8px 0',
    paddingLeft: '16px',
};

const buttonContainer = {
    textAlign: 'center',
    margin: '32px 0',
};

const button = {
    backgroundColor: '#4F46E5',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '12px 32px',
    border: 'none',
};

const link = {
    color: '#4F46E5',
    textDecoration: 'underline',
};

const hr = {
    borderColor: '#e6ebf1',
    margin: '32px 0',
};

const footer = {
    padding: '0 48px 24px',
    textAlign: 'center',
};

const footerText = {
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#9ca299',
    margin: '8px 0',
};