import { createContext, useContext, useState, ReactNode } from 'react';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from "../../../firebase/firebase";
// import { query, where } from 'firebase/firestore';
// import { auth } from "../../../firebase/firebase";

//TODO: Remove the status fields. Only task created via a project should have a status field

export type TaskStatus = "pending" | "ongoing" | "completed";
export interface TaskData {
    id: string;
    title: string;
    label?: string; 
    completion: boolean;
    content?: string; 
    projectId?: string;
    status: TaskStatus; //TODO: Remove this field
    dueDate?: Date;
    createdAt: Timestamp;
}

export interface TaskCardProps {
    task: TaskData;
}

interface tasksContextType {
    tasks: TaskData[];
    fetchTasks: () => void;
    deleteTask: (id: string) => void;
    createTask: (title: string, content: string, dueDate?: string) => void;
    toggleTaskCompletion: (id: string) => void;
    // updateTaskDueDate: (id: string, dueDate: Date) => void;
}

const taskContext = createContext<tasksContextType | undefined>(undefined);

export const UseTasks = () => {
    const context = useContext(taskContext);
    if (!context) {
        throw new Error("Usetasks must be used within a tasksProvider");
    }
    return context;
};

export const TaskProvider = ({ children }: { children: ReactNode; }) => {
    const [tasks, setTasks] = useState<TaskData[]>([]);

    const fetchTasks = async () => {
        // Go back and add the auth match check so that a user can only see tasks associated with their own account (unique id)

        const tasksCollection = collection(db, "tasks");
        // const tasksQuery = query(tasksCollection, where("userId", "==", auth.currentUser.uid)) ignore this for now
        const taskSnapshot = await getDocs(tasksCollection);

        const taskList = taskSnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content,
            label: doc.data().label,
            projectId: doc.data().projectId,
            completion: doc.data().completion,
            dueDate: doc.data().dueDate,
            status: doc.data().status as TaskStatus,
            // dueDate: doc.data().dueDate,
            createdAt: doc.data().createdAt
        }));

        setTasks(taskList.sort((a, b) => b.createdAt - a.createdAt));
    };

    const createTask = async (title: string, content?: string, projectId?: string, dueDate?: Date) => {
        //if (!auth.currentUser) return;

        const newDate = Timestamp.fromDate(new Date());

        try {
            
            const docRef = await addDoc(collection(db, "tasks"), {
                title,
                content,
                createdAt: newDate,
                label: "",
                projectId: projectId || "",
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status: "pending" as TaskStatus,
                completion: false
                //userId: auth.currentUser.uid
            });

            if (projectId) {
                const projectRef = doc(db, "projects", projectId);
                await updateDoc(projectRef, {
                    tasks: arrayUnion(docRef.id)
                });
            }

            setTasks([
                {
                    id: docRef.id,
                    title,
                    content,
                    createdAt: newDate,
                    label: "",
                    projectId: projectId || "",
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                    // dueDate: dueDate ? new Date(dueDate) : undefined,
                    status: "pending" as TaskStatus,
                    completion: false
                }, ...tasks
            ]);

        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await deleteDoc(doc(db, "tasks", id));
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const toggleTaskCompletion = async (id: string) => {
        try {
            await updateDoc(doc(db, "tasks", id), {
                completion: !tasks.find(task => task.id === id)?.completion
            });
        } catch (error) {
            console.error("Error toggling task completion:", error);
        }
    };

    return (
        <taskContext.Provider value={ { tasks, fetchTasks, createTask, deleteTask, toggleTaskCompletion } }>
            { children }
        </taskContext.Provider>
    );
};