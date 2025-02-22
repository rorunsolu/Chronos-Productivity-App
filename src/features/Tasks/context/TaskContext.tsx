import { createContext, useContext, useState, ReactNode } from 'react';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from "../../../firebase/firebase";
// import { query, where } from 'firebase/firestore';
// import { auth } from "../../../firebase/firebase";

export interface taskData {
    id: string;
    title: string;
    label?: string; // the ? means label is optional
    completion: boolean;
    createdAt: Timestamp;
}

interface tasksContextType {
    tasks: taskData[];
    fetchTasks: () => void;
    deleteTask: (id: string) => void;
    createTask: (title: string) => void;

    toggleTaskCompletion: (id: string) => void;
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
    const [tasks, setTasks] = useState<taskData[]>([]);

    const fetchTasks = async () => {
        // Go back and add the auth match check so that a user can only see tasks associated with their own account (unique id)

        const tasksCollection = collection(db, "tasks");
        // const tasksQuery = query(tasksCollection, where("userId", "==", auth.currentUser.uid)) ignore this for now
        const taskSnapshot = await getDocs(tasksCollection);

        const taskList = taskSnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            label: doc.data().label,
            completion: doc.data().completion,
            createdAt: doc.data().createdAt
        }));

        setTasks(taskList.sort((a, b) => b.createdAt - a.createdAt));
    };

    const createTask = async (title: string) => {
        //if (!auth.currentUser) return;

        const newDate = Timestamp.fromDate(new Date());

        try {
            const docRef = await addDoc(collection(db, "tasks"), {
                title,
                createdAt: newDate,
                label: "", // Assuming label is an empty string initially
                completion: false // Set initial completion state to false
                //userId: auth.currentUser.uid
            });

            setTasks([
                {
                    id: docRef.id,
                    title,
                    createdAt: newDate,
                    label: "", // Assuming label is an empty string initially
                    completion: false // Set initial completion state to false
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
        <taskContext.Provider value={{ tasks, fetchTasks, createTask, deleteTask, toggleTaskCompletion }}>
            {children}
        </taskContext.Provider>
    );
};