import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import {
   Check,
   EllipsisVertical,
   ListFilter,
   Plus,
   Search,
   Star,
   Trash
} from "lucide-react";
import { TaskData, UseTasks } from "../../features/Tasks/context/TaskContext";
import { useNavigate } from "react-router-dom";
import "./TaskPage.scss";
import "@/components/Creation Modal/CreationModal.scss";
import DateTimePickerCompo from "@/components/Date Time Picker Compo/DateTimePickerCompo";

const TaskPage = () => {

   const navigate = useNavigate();
   const { tasks, fetchTasks, createTask, deleteTask, toggleTaskCompletion } = UseTasks();
   const [taskTitle, setTaskTitle] = useState("");
   const [taskContent, setTaskContent] = useState("");
   const [taskStatus, setTaskStatus] = useState("");
   const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
   const [taskLabel, setTaskLabel] = useState("");
   const [searchQuery, setSearchQuery] = useState("");
   const [isModalOpen, setIsModalOpen] = useState(false);
   const openModal = () => setIsModalOpen(true);

   useEffect(() => {
      fetchTasks();
   }, [fetchTasks]);

   const filteredTasks = tasks.filter(task => {
      const searchLower = searchQuery.toLowerCase();
      return (
         task.title.toLowerCase().includes(searchLower) ||
         task.content?.toLowerCase().includes(searchLower)
      );
   });

   const handlecreateTask = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      //! The order of the parameters is important (match the order in the tasksContextType interface)
      createTask(taskTitle, taskContent, undefined, taskDueDate, taskLabel);
      setTaskTitle("");
      setTaskContent("");
      setTaskDueDate(null);
      setTaskStatus("");
      setTaskLabel("");
      setIsModalOpen(false);
   };

   const completionToggle = (task: TaskData) => {
      toggleTaskCompletion(task.id);
   };

   return (

      <div className="flex w-full h-full justify-center items-center mt-16">

         <div className="taskpage">

            <div className="taskpage__header">

               <h1 className="taskpage__title">Tasks</h1>
               <p className="taskpage__subtitle">All your tasks in one place</p>

            </div>

            <div className="taskpage__actions">

               <form className="taskpage__form">
                  <Search />
                  <input
                     className="taskpage__form-input"
                     type="text"
                     placeholder="Search tasks"
                     value={ searchQuery }
                     onChange={ (e) => setSearchQuery(e.target.value) }
                  />
               </form>

               <button className="taskpage__actions-button" type="button" onClick={ openModal }>
                  <Plus />
               </button>

               <button className="taskpage__actions-button">
                  <ListFilter />
               </button>

               <button className="taskpage__actions-button">
                  <EllipsisVertical />
               </button>

            </div>

            <Modal
               isOpen={ isModalOpen }
               onRequestClose={ () => setIsModalOpen(false) }
               contentLabel="Create a new task"
               className="modal"
               overlayClassName="modal-overlay"
               appElement={ document.getElementById('root') || undefined }>

               <p className="modal__title">Create a task</p>

               <form className="modal__form" onSubmit={ handlecreateTask }>

                  <div className="modal__input-group">
                     <input
                        className="modal__input"
                        onChange={ (e) => setTaskTitle(e.target.value) }
                        value={ taskTitle }
                        type="text"
                        placeholder="Title"
                     />
                  </div>

                  <div className="modal__input-group">
                     <textarea
                        className="modal__textarea"
                        onChange={ (e) => setTaskContent(e.target.value) }
                        value={ taskContent }
                        placeholder="Content"
                     />
                  </div>

                  <div className="modal__input-group">
                     <DateTimePickerCompo
                        value={ taskDueDate }
                        onChange={ (date) => setTaskDueDate(date) }
                     />
                  </div>

                  <div className="modal__input-group">
                     <input
                        className="modal__input"
                        onChange={ (e) => setTaskStatus(e.target.value) }
                        value={ taskStatus }
                        type="text"
                        placeholder="Status"
                     />
                  </div>

                  <div className="modal__input-group">
                     <input
                        className="modal__input"
                        onChange={ (e) => setTaskLabel(e.target.value) }
                        value={ taskLabel }
                        type="text"
                        placeholder="Label"
                     />
                  </div>

                  <div className="modal__button-group">

                     <button
                        className="modal__button"
                        onClick={ () => setIsModalOpen(false) }
                        type="button"
                     >
                        Cancel
                     </button>

                     <button className="modal__button" disabled={ !taskTitle || !taskContent } type="submit">
                        Create Task
                     </button>

                  </div>

               </form>

            </Modal>

            <div className="taskpage__task-list">
               { filteredTasks.map(task => (
                  <li className="taskpage-card" key={ task.id } onClick={ () => navigate(`/tasks/${task.id}`) } >

                     <div className="taskpage-card__left">
                        <div
                           role="checkbox"
                           onClick={ (e) => { e.stopPropagation(); completionToggle(task); } }
                           className={ `taskpage-card__checkbox ${task.completion ? "taskpage-card__checkbox--checked" : ""}` }
                        >
                           { task.completion && <span className="taskpage-card__checkbox-icon"><Check /></span> }
                        </div>

                        <div className="taskpage-card__content">
                           <p className="taskpage-card__title">{ task.title }</p>
                           <p className="taskpage-card__description">{ task.content }</p>
                        </div>

                     </div>

                     <div className="taskpage-card__actions">

                        <button className="taskpage-card__button" onClick={ (e) => e.stopPropagation() }>
                           <Star />
                        </button>

                        <button className="taskpage-card__button" onClick={ (e) => { e.stopPropagation(); deleteTask(task.id); } }>
                           <Trash />
                        </button>

                     </div>

                  </li>
               )) }
            </div>

         </div>

      </div >

   );
};

export default TaskPage;