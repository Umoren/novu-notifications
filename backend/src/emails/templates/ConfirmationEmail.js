import React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Img,
    Preview
} from '@react-email/components';

export default function ConfirmationEmail({
    firstName = 'User',
    companyName = 'Your Company',
    confirmUrl = '#',
    expiresIn = '24 hours'
}) {
    return React.createElement(Html, null,
        React.createElement(Head),
        React.createElement(Preview, null, "Please confirm your email address"),
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
                        "Confirm Your Email Address 📧"
                    ),

                    React.createElement(Text, { style: paragraph },
                        `Hi ${firstName},`
                    ),

                    React.createElement(Text, { style: paragraph },
                        `Thanks for signing up with ${companyName}! To complete your registration, please confirm your email address by clicking the button below.`
                    ),

                    React.createElement(Section, { style: buttonContainer },
                        React.createElement(Button, { href: confirmUrl, style: button },
                            "Confirm Email Address"
                        )
                    ),

                    React.createElement(Text, { style: paragraph },
                        `This confirmation link will expire in `,
                        React.createElement('strong', null, expiresIn),
                        `. If you didn't create an account with us, you can safely ignore this email.`
                    ),

                    React.createElement(Hr, { style: hr }),

                    React.createElement(Text, { style: smallText },
                        "If the button above doesn't work, you can copy and paste this link into your browser:"
                    ),
                    React.createElement(Text, { style: linkText },
                        confirmUrl
                    )
                ),

                // Footer
                React.createElement(Section, { style: footer },
                    React.createElement(Text, { style: footerText },
                        "Thanks,",
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

const buttonContainer = {
    textAlign: 'center',
    margin: '32px 0',
};

const button = {
    backgroundColor: '#059669',
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

const hr = {
    borderColor: '#e6ebf1',
    margin: '32px 0',
};

const smallText = {
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#6b7280',
    margin: '16px 0 8px',
};

const linkText = {
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#4F46E5',
    wordBreak: 'break-all',
    margin: '0 0 16px',
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