import { auth, db } from "@/firebase/firebase";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
} from "firebase/firestore";

export type ProjectStatus = "Pending" | "Ongoing" | "Completed";

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  tasks: string[];
  label?: string;
  status: ProjectStatus;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  userId?: string;
  contentType: string;
}

interface ProjectsContextType {
  projects: ProjectData[];
  fetchProjects: () => void;
  createProject: (name: string, description?: string, label?: string) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<ProjectData>) => void;
  addTaskToProject: (projectId: string, taskId: string) => void;
  removeTaskFromProject: (projectId: string, taskId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export const UseProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("UseProjects must be used within a ProjectsProvider");
  }
  return context;
};

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const fetchProjects = async () => {
    try {
      const projectsQuery = query(
        collection(db, "projects"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const projectSnapshot = await getDocs(projectsQuery);

      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        tasks: doc.data().tasks || [],
        label: doc.data().label,
        status: doc.data().status as ProjectStatus,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
        userId: doc.data().userId,
        contentType: doc.data().contentType,
      }));

      setProjects(
        projectList.sort(
          (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
        )
      );
      console.log("Projects fetched with fetchProjects hook");
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const createProject = async (
    name: string,
    description?: string,
    label?: string
  ) => {
    const newDate = Timestamp.fromDate(new Date());
    const user = auth.currentUser;

    if (!user) {
      alert("Authentication required");
      return;
    }

    try {
      const projectData = {
        name,
        description: description || "",
        tasks: [],
        label: label || "",
        userId: user.uid,
        status: "Pending" as ProjectStatus,
        createdAt: newDate,
        updatedAt: newDate,
        contentType: "Project",
      };

      const docRef = await addDoc(collection(db, "projects"), projectData);

      setProjects([
        {
          id: docRef.id,
          ...projectData,
          createdAt: newDate,
          updatedAt: newDate,
        },
        ...projects,
      ]);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Authentication required");
      return;
    }

    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter((project) => project.id !== id));
      console.log("Project deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const updateProject = async (id: string, updates: Partial<ProjectData>) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Authentication required");
      return;
    }

    try {
      const projectRef = doc(db, "projects", id);

      const updatesToProject = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      await updateDoc(projectRef, updatesToProject);

      setProjects(
        projects.map((project) =>
          project.id === id
            ? {
                ...project,
                ...updatesToProject,
              }
            : project
        )
      );
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const addTaskToProject = async (projectId: string, taskId: string) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Authentication required");
      return;
    }

    try {
      const projectRef = doc(db, "projects", projectId);
      const taskRef = doc(db, "tasks", taskId);

      await updateDoc(projectRef, {
        tasks: arrayUnion(taskId),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      await updateDoc(taskRef, {
        projectId: projectId,
        status: "Pending",
      });

      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: [...project.tasks, taskId],
                updatedAt: Timestamp.fromDate(new Date()),
              }
            : project
        )
      );

      console.log(
        `Task with ID ${taskId} has been added to project with ID ${projectId}`
      );
    } catch (error) {
      console.error("Error adding task to project:", error);
    }
  };

  const removeTaskFromProject = async (projectId: string, taskId: string) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      const taskRef = doc(db, "tasks", taskId);

      await updateDoc(projectRef, {
        tasks: arrayRemove(taskId),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      await updateDoc(taskRef, {
        projectId: "",
      });

      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter((id) => id !== taskId),
                updatedAt: Timestamp.fromDate(new Date()),
              }
            : project
        )
      );
    } catch (error) {
      console.error("Error removing task from project:", error);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        fetchProjects,
        createProject,
        deleteProject,
        updateProject,
        addTaskToProject,
        removeTaskFromProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};
