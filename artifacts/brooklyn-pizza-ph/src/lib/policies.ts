export const policies = {
  terms: {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions',
    description: 'Terms for using the Brooklyn Pizza website and placing orders.',
    sections: [
      {
        title: 'Using this website',
        text: 'This website provides information about Brooklyn Pizza in Iloilo and links to our online ordering service. Please provide accurate information when contacting us or submitting an inquiry.',
      },
      {
        title: 'Orders, prices and availability',
        text: 'Online orders are placed through our linked Utak store. Review the menu, prices, availability, order details and any applicable charges shown there before confirming your order. Website photos are illustrative; actual presentation may vary.',
      },
      {
        title: 'Allergies and dietary requirements',
        text: 'Please contact the shop before ordering if you have a food allergy or dietary requirement. Do not assume that a menu item is free of an allergen or that cross-contact cannot occur.',
      },
      {
        title: 'Order concerns',
        text: 'For questions about an order, contact us at 033 338 4417 with your order details. Our Return and Refund Policy explains our standard store-credit policy. These terms do not limit any rights or remedies required by Philippine law.',
      },
    ],
  },
  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'How Brooklyn Pizza handles information provided through this website.',
    sections: [
      {
        title: 'Information you provide',
        text: 'Our franchise inquiry form asks for your first and last name, email address, available capital range and desired shop location. We use this information to review your interest, respond to you and discuss a potential franchise opportunity.',
      },
      {
        title: 'Technical information and service providers',
        text: 'Our hosting and security services may process technical information such as your IP address and request information to operate and protect the website. Service providers involved in hosting and email delivery may process inquiry information to provide those services.',
      },
      {
        title: 'External ordering and links',
        text: 'Ordering takes place on Utak, not within this website. Information you provide to that service is handled under its applicable privacy policies and terms. Other external websites, including map services, have their own privacy practices.',
      },
      {
        title: 'Retention and protection',
        text: 'We retain inquiry information only as long as needed for the purpose for which it was provided and any applicable legal obligations. Please do not include payment card details or other unnecessary sensitive information in your inquiry.',
      },
      {
        title: 'Your privacy requests',
        text: 'To ask about your information or request access, correction or deletion, contact Brooklyn Pizza at 033 338 4417. We will handle requests subject to applicable Philippine data privacy law and any legal retention requirements.',
      },
    ],
  },
  refunds: {
    path: '/return-and-refund-policy',
    title: 'Return and Refund Policy',
    description: 'Brooklyn Pizza’s policy on order concerns and credit for your next visit.',
    sections: [
      {
        title: 'Credit for your next visit',
        text: 'Under our standard store policy, we do not give cash or payment-method refunds. For approved order concerns, we provide store credit to use on your next visit instead.',
      },
      {
        title: 'Report an order concern',
        text: 'If your order is incorrect, incomplete or has a quality concern, please contact the shop at 033 338 4417 as soon as possible. Have your order confirmation or receipt ready, and provide details or photos where available so we can review the issue and arrange any applicable credit.',
      },
      {
        title: 'Returning food',
        text: 'Because our products are freshly prepared food, please contact us before bringing an item back. If you believe an item is unsafe to eat, do not consume it; contact the shop for assistance.',
      },
      {
        title: 'Your legal rights',
        text: 'This store-credit policy does not exclude or restrict your non-waivable consumer rights under Philippine law. Where the law requires a refund or another remedy, we will provide that remedy.',
      },
    ],
  },
} as const;

export type PolicyId = keyof typeof policies;
