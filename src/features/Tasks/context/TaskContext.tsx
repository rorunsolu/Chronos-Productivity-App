import { auth, db } from "@/firebase/firebase";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export type TaskStatus = "Pending" | "Ongoing" | "Completed";

export interface TaskData {
  id: string;
  title: string;
  label?: string;
  completion: boolean;
  content?: string;
  projectId?: string;
  status: TaskStatus;
  dueDate?: string | null;
  createdAt: Timestamp;
  userId?: string;
  contentType: string;
}

interface TasksContextType {
  tasks: TaskData[];
  fetchTasks: () => void;
  deleteTask: (id: string) => void;
  createTask: (
    title: string,
    content?: string,
    dueDate?: string | null,
    label?: string,
    status?: TaskStatus,
    projectId?: string
  ) => void;
  toggleTaskCompletion: (id: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const UseTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("Usetasks must be used within a tasksProvider");
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);

  const fetchTasks = async () => {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", auth.currentUser?.uid)
    );
    const taskSnapshot = await getDocs(tasksQuery);

    const taskList = taskSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      content: doc.data().content,
      label: doc.data().label,
      projectId: doc.data().projectId,
      completion: doc.data().completion,
      dueDate: doc.data().dueDate,
      status: doc.data().status as TaskStatus,
      createdAt: doc.data().createdAt,
      userId: doc.data().userId,
      contentType: doc.data().contentType,
    }));

    setTasks(
      taskList.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    );
  };

  const createTask = async (
    title: string,
    content?: string,
    dueDate?: string | null,
    label?: string,
    status?: TaskStatus,
    projectId?: string
  ) => {
    const newDate = Timestamp.fromDate(new Date());
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated");
    }

    try {
      const taskData = {
        title,
        content,
        dueDate: dueDate || "",
        createdAt: Timestamp.now(),
        label: label || "",
        status: status || "Pending",
        projectId: projectId || "",
        userId: user.uid,
        completion: false,
        contentType: "Task",
      };

      const docRef = await addDoc(collection(db, "tasks"), taskData);

      if (projectId) {
        const projectRef = doc(db, "projects", projectId);
        await updateDoc(projectRef, {
          tasks: arrayUnion(docRef.id),
        });
      }

      setTasks([
        {
          id: docRef.id,
          ...taskData,
          createdAt: newDate,
        },
        ...tasks,
      ]);
    } catch (error) {
      throw new Error(`Error creating task: ${error}`);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      throw new Error(`Error deleting task: ${error}`);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        completion: !tasks.find((task) => task.id === id)?.completion,
      });
    } catch (error) {
      throw new Error(`Error toggling task completion: ${error}`);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        fetchTasks,
        createTask,
        deleteTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
