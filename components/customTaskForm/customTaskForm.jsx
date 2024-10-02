"use client";

import * as ReactHookForm from "react-hook-form";
import {Button} from "../ui/button";
import * as React from "react";
import dayjs from "dayjs";
import {LocalizationProvider, AdapterDayjs, DateTimePicker} from "@mui/x-date-pickers";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import {Input} from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {MdArrowBack, MdCheckCircle, MdError} from "react-icons/md";
import {useRouter} from "next/navigation";

const CustomTaskForm = () => {
    const [submitStatus, setSubmitStatus] = React.useState(null);
    const router = useRouter();

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

    const watchRole = form.watch("role");

    const onSubmit = async (data) => {
        try {
            const response = await fetch("/api/addCustomtask", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({data}),
            });

            if (!response.ok) throw new Error(`Failed to submit the form: ${response.status} ${response.statusText}`);

            const sendNotification = await fetch("/api/sendCustomTaskNotification", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({data}),
            });

            if (!sendNotification.ok) throw new Error(`Failed to send notification: ${sendNotification.status} ${sendNotification.statusText}`);

            setSubmitStatus("success");
            form.reset();
        } catch (error) {
            console.error("Error:", error);
            setSubmitStatus("error");
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-3xl">
                <div className="p-6 relative">
                    <button onClick={() => router.push("/dashboard/task")}
                            className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center">
                        <MdArrowBack className="mr-2"/> Back
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Add Custom Task</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="role" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline"
                                                        className="w-full justify-start">{field.value || "Select Role"}</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full">
                                                <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuRadioGroup value={field.value}
                                                                        onValueChange={field.onChange}>
                                                    <DropdownMenuRadioItem value="Driver">Driver</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem
                                                        value="Maintenance">Maintenance</DropdownMenuRadioItem>
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="taskTitle" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Task Title</FormLabel>
                                        <FormControl><Input placeholder="Enter task title" {...field} /></FormControl>
                                        <FormDescription>Provide a brief title for the task.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="taskDescription" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Task Description</FormLabel>
                                        <FormControl><Input
                                            placeholder="Describe the task in detail" {...field} /></FormControl>
                                        <FormDescription>Provide a detailed description of the task.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="location" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl><Input
                                            placeholder="Enter task location" {...field} /></FormControl>
                                        <FormDescription>Specify where the task will take place.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                {watchRole !== "Maintenance" && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name="guestFirstName"
                                                       render={({field}) => (
                                                           <FormItem>
                                                               <FormLabel>Guest First Name</FormLabel>
                                                               <FormControl><Input
                                                                   placeholder="John" {...field} /></FormControl>
                                                               <FormMessage/>
                                                           </FormItem>
                                                       )}/>
                                            <FormField control={form.control} name="guestName" render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Guest Last Name</FormLabel>
                                                    <FormControl><Input placeholder="Smith" {...field} /></FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}/>
                                        </div>
                                        <FormField control={form.control} name="guestPhone" render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl><Input
                                                    placeholder="Enter guest's phone number" {...field} /></FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}/>
                                    </>
                                )}
                                <FormField control={form.control} name="date" render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date & Time</FormLabel>
                                        <FormControl>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker value={field.value ? dayjs(field.value) : null}
                                                                onChange={(newValue) => field.onChange(newValue ? newValue.toISOString() : null)}
                                                                renderInput={(props) => <Input {...props} />}/>
                                            </LocalizationProvider>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Submit
                                    Task</Button>
                            </form>
                        </Form>
                        {submitStatus && (
                            <Alert variant={submitStatus === "success" ? "default" : "destructive"} className="mt-6">
                                {submitStatus === "success" ? <MdCheckCircle className="h-4 w-4"/> :
                                    <MdError className="h-4 w-4"/>}
                                <AlertTitle>{submitStatus === "success" ? "Success!" : "Error!"}</AlertTitle>
                                <AlertDescription>
                                    {submitStatus === "success" ? "Your task has been successfully submitted." : "There was an error submitting your task. Please try again."}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomTaskForm;