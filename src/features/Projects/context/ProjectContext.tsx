import { createContext, useContext, useState, ReactNode } from 'react';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from "../../../firebase/firebase";

type ProjectStatus = "pending" | "ongoing" | "completed";
export type ProjectPriority = "low" | "medium" | "high";

export interface ProjectData {
   id: string;
   name: string;
   description?: string;
   tasks: string[]; // Array of task IDs
   label?: string;
   priority: ProjectPriority;
   status: ProjectStatus;
   createdAt: Timestamp;
   updatedAt?: Timestamp;
}

interface ProjectsContextType {
   projects: ProjectData[];
   fetchProjects: () => void;
   createProject: (name: string, description?: string, label?: string, priority?: string) => void;
   deleteProject: (id: string) => void;
   updateProject: (id: string, updates: Partial<ProjectData>) => void;
   addTaskToProject: (projectId: string, taskId: string) => void;
   removeTaskFromProject: (projectId: string, taskId: string) => void;
}

export interface ProjectCardProps {
   project: ProjectData;
   // deleteProject: (id: string) => void;
   // updateProject: (id: string, updates: Partial<ProjectData>) => void;
   // addTaskToProject: (projectId: string, taskId: string) => void;
}


const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const UseProjects = () => {
   const context = useContext(ProjectsContext);
   if (!context) {
      throw new Error("UseProjects must be used within a ProjectsProvider");
   }
   return context;
};

export const ProjectsProvider = ({ children }: { children: ReactNode; }) => {
   const [projects, setProjects] = useState<ProjectData[]>([]);

   const fetchProjects = async () => {
      try {
         const projectsCollection = collection(db, "projects");
         const projectSnapshot = await getDocs(projectsCollection);
         const projectList = projectSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            tasks: doc.data().tasks || [],
            label: doc.data().label,
            priority: doc.data().priority as ProjectPriority,
            status: doc.data().status as ProjectStatus,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
         }));

         setProjects(projectList.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));

      } catch (error) {
         console.error("Error fetching projects:", error);
      }
   };

   const createProject = async (name: string, description?: string, label?: string, prioity?: string) => {
      const newDate = Timestamp.fromDate(new Date());
      try {
         const docRef = await addDoc(collection(db, "projects"), {
            name,
            description: description || "",
            tasks: [],
            label: label || "",
            // priority: "low" as ProjectPriority,
            priority: prioity as ProjectPriority,
            status: "pending" as ProjectStatus,
            createdAt: newDate,
            updatedAt: newDate,
         });
         setProjects([{
            id: docRef.id,
            name,
            description: description || "",
            tasks: [],
            label: label || "",
            // priority: "low" as ProjectPriority,
            priority: prioity as ProjectPriority,
            status: "pending" as ProjectStatus,
            createdAt: newDate,
            updatedAt: newDate,
         }, ...projects]);
      } catch (error) {
         console.error("Error creating project:", error);
      }
   };

   const deleteProject = async (id: string) => {
      try {
         await deleteDoc(doc(db, "projects", id));
         setProjects(projects.filter(project => project.id !== id));
      } catch (error) {
         console.error("Error deleting project:", error);
      }
   };

   const updateProject = async (id: string, updates: Partial<ProjectData>) => {
      try {
         const projectRef = doc(db, "projects", id);
         const updateData = {
            ...updates,
            updatedAt: Timestamp.fromDate(new Date()),
         };
         await updateDoc(projectRef, updateData);
         setProjects(projects.map(project =>
            project.id === id ? { ...project, ...updateData } : project
         ));
      } catch (error) {
         console.error("Error updating project:", error);
      }
   };

   const addTaskToProject = async (projectId: string, taskId: string) => {
      try {
         const projectRef = doc(db, "projects", projectId);
         await updateDoc(projectRef, {
            tasks: arrayUnion(taskId),
            updatedAt: Timestamp.fromDate(new Date()),
         });
         setProjects(projects.map(project =>
            project.id === projectId ? {
               ...project,
               tasks: [...project.tasks, taskId],
               updatedAt: Timestamp.fromDate(new Date())
            } : project
         ));
      } catch (error) {
         console.error("Error adding task to project:", error);
      }
   };

   const removeTaskFromProject = async (projectId: string, taskId: string) => {
      try {
         const projectRef = doc(db, "projects", projectId);
         await updateDoc(projectRef, {
            tasks: arrayRemove(taskId),
            updatedAt: Timestamp.fromDate(new Date()),
         });
         setProjects(projects.map(project =>
            project.id === projectId ? {
               ...project,
               tasks: project.tasks.filter(id => id !== taskId),
               updatedAt: Timestamp.fromDate(new Date())
            } : project
         ));
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
            removeTaskFromProject
         }}
      >
         {children}
      </ProjectsContext.Provider>
   );
};