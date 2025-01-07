'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'

interface Props {
    closeParentDialog?: () => void;
}

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters',
    }).max(50, {
        message: 'Title must be less than 50 characters',
    }),
})

async function createTodo(title: string) {
    fetch('http://localhost:5000/createTodo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        toast("Todo created!", {
        })
    })
    .catch(error => {
        console.log(error);
        toast("Failed to create Todo!", {
        })
    })
}

export function CreateTodoForm({closeParentDialog}: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createTodo(values.title);

        if (typeof closeParentDialog === 'function') closeParentDialog();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Exercise for 30 minutes" {...field} />
                            </FormControl>
                            {/* <FormDescription>
                                Todo description.
                            </FormDescription> */}
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type='submit'>Create</Button>
            </form>
        </Form>
    )
}