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
    question: "What's the difference between a Driver and a Maintenance role?",
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Start Guide</h2>
        <Card>
          <CardHeader>
            <CardTitle>Getting Started with KPN Senior Project 1</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Log in to your account: Use your email and password to access
                the dashboard.
              </li>
              <li>
                Explore the dashboard: Familiarize yourself with the main
                sections: Users, Chat, Tasks, and Bookings.
              </li>
              <li>
                Set up your profile: Go to Settings to update your personal
                information and preferences.
              </li>
              <li>
                Create your first task: Navigate to the Tasks page to add and
                manage tasks for your team.
              </li>
              <li>
                Check your bookings: View and manage all your property bookings
                in the Bookings section.
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              If you can't find the answer you're looking for, our support team
              is here to help:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Email Support: support@kpnproject.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Phone Support: +1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Live Chat: Available 24/7</span>
            </div>
            <Button className="mt-4">
              <MessageCircle className="mr-2 h-4 w-4" /> Start Live Chat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
