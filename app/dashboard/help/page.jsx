import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I add a new team member?",
    answer:
      "To add a new team member, go to the 'Users' page and click on the 'Add New' button. Fill in the required information and assign the appropriate role.",
  },
  {
    question: "How can I update a booking?",
    answer:
      "Navigate to the 'Bookings' page, find the booking you want to update, and click on the edit icon. Make your changes in the form that appears and save your updates.",
  },
  {
    question:
      "What's the difference between a Driver and a Maintenance role?",
    answer:
      "The Driver role is responsible for guest transportation tasks, while the Maintenance role handles property upkeep and repairs. Each role has access to specific tasks and information relevant to their responsibilities.",
  },
  {
    question: "How do I create a custom task?",
    answer:
      "Go to the 'Tasks' page and click on 'Add Task'. Fill out the task details, including title, description, assigned role, and due date. Custom tasks can be assigned to specific roles like Driver or Maintenance.",
  },
  {
    question: "Can I change my notification preferences?",
    answer:
      "Yes, you can adjust your notification settings in the 'Settings' page under the 'Notifications' tab. Here you can toggle email and push notifications according to your preferences.",
  },
];

const HelpPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl mb-4 mt-2">
      <h1 className="text-4xl font-bold mb-8 text-center">Help Center</h1>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Quick Start Guide</h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Getting Started with KPN Senior Project 1</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Log in to your account: Use your email and password to access the dashboard.</li>
              <li>Explore the dashboard: Familiarize yourself with the main sections: Users, Chat, Tasks, and Bookings.</li>
              <li>Set up your profile: Go to Settings to update your personal information and preferences.</li>
              <li>Create your first task: Navigate to the Tasks page to add and manage tasks for your team.</li>
              <li>Check your bookings: View and manage all your property bookings in the Bookings section.</li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-6">Need More Help?</h2>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Support</CardTitle>
            <CardDescription className="text-gray-600">
              If you can't find the answer you're looking for, our support team is here to help:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Email Support: support@kpnproject.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Phone Support: +1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Live Chat: Available 24/7</span>
            </div>
            <Button className="mt-4 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700">
              <MessageCircle className="mr-2 h-4 w-4" /> Start Live Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;