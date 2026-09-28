import * as React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  total: number;
  items: OrderItem[];
}

export const OrderConfirmationEmail = ({
  customerName,
  orderNumber,
  total,
  items,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Captain Farmery order #{orderNumber} is confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Order Confirmed!</Heading>
        <Text style={text}>
          Hi {customerName},
        </Text>
        <Text style={text}>
          Thank you for shopping with Captain Farmery. We've received your order <strong>#{orderNumber}</strong> and it is now being processed.
        </Text>
        
        <Section style={orderSection}>
          <Heading as="h2" style={h2}>Order Summary</Heading>
          {items.map((item, index) => (
            <Text key={index} style={itemText}>
              {item.quantity}x {item.name} - ₹{(item.price * item.quantity).toFixed(2)}
            </Text>
          ))}
          <Hr style={hr} />
          <Text style={totalText}>
            <strong>Total:</strong> ₹{total.toFixed(2)}
          </Text>
        </Section>

        <Text style={footer}>
          If you have any questions, reply to this email or contact us at support@srikalpavriksha.com.
        </Text>
        <Text style={footer}>
          Captain Farmery, Golden Mile Road, Kokapet, Hyderabad
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  maxWidth: '600px',
};

const h1 = {
  color: '#2E7D32',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '0 0 20px 0',
};

const h2 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  padding: '0',
  margin: '0 0 15px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
};

const orderSection = {
  backgroundColor: '#f9fbfd',
  padding: '20px',
  borderRadius: '4px',
  margin: '20px 0',
};

const itemText = {
  color: '#333333',
  fontSize: '14px',
  margin: '0 0 10px 0',
};

const totalText = {
  color: '#111111',
  fontSize: '16px',
  margin: '10px 0 0 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '15px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '20px',
};
