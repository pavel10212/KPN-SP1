"use client";

import * as ReactHookForm from "react-hook-form";
import { Button } from "../ui/button";
import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CustomTaskForm = () => {
  const [submitStatus, setSubmitStatus] = React.useState(null);

  const form = ReactHookForm.useForm({
    defaultValues: {
      taskTitle: "",
      taskDescription: "",
      role: "",
      guestFirstName: "",
      guestName: "",
      location: "",
      guestPhone: "",
      date: dayjs().toISOString(),
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/addCustomtask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      setSubmitStatus("success");
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-16 ">
              <FormLabel>Role</FormLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {field.value || "Select Role"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <DropdownMenuRadioItem value="Driver">
                      Driver
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Maintenance">
                      Maintenance
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taskDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Pick up guests from airport at gate ..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Write the task desired to be done.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taskTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Pick up" {...field} />
              </FormControl>
              <FormDescription>
                Write the task tile desired to be done.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guestFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormDescription>
                Enter the first name of the guest.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guest Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Smith" {...field} />
              </FormControl>
              <FormDescription>
                Enter the last name of the guest.
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter the location of </FormLabel>
              <FormControl>
                <Input placeholder="Suvarnabhumi aiport gate 3" {...field} />
              </FormControl>
              <FormDescription>
                Enter the location of the pick up
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guestPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="091321313" {...field} />
              </FormControl>
              <FormDescription>
                Enter the phone number of the guest
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date & Time"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) =>
                      field.onChange(newValue ? newValue.toISOString() : null)
                    }
                  />
                </LocalizationProvider>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CustomTaskForm;
