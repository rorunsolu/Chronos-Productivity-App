import { UserAuth } from "@/contexts/authContext/AuthContext";
import { TaskData, UseTasks } from "@/features/Tasks/context/TaskContext";
import { DatePickerInput } from "@mantine/dates";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "@/pages/Task List Page/TaskListPage.scss";
import "@/components/Creation Modal/CreationModal.scss";
import TaskListCard from "@/features/Tasks/Task List Card/TaskListCard";
import SearchBar from "@/components/Search Bar/SearchBar";
import AddButton from "@/components/Add Button/AddButton";
import SortToggleButton from "@/components/Sort Toggle Button/SortToggleButton";

const TaskListPage = () => {
  const { user } = UserAuth();
  const { tasks, fetchTasks, createTask, deleteTask, toggleTaskCompletion } =
    UseTasks();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskContent, setTaskContent] = useState("");
  const [taskLabel, setTaskLabel] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewestFirst, setIsNewestFirst] = useState(true);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const openModal = () => setIsModalOpen(true);

  const filteredTasks = tasks
    .filter((task) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.content?.toLowerCase().includes(searchLower) ||
        task.status?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const dateA = a.createdAt.toDate();
      const dateB = b.createdAt.toDate();
      return isNewestFirst
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  const handlecreateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    createTask(
      taskTitle,
      taskContent,
      taskDueDate,
      taskLabel,
      undefined,
      undefined
    );
    setTaskTitle("");
    setTaskContent("");
    setTaskDueDate(null);
    setTaskLabel("");
    setIsModalOpen(false);
  };

  const completionToggle = (task: TaskData) => {
    toggleTaskCompletion(task.id);
    fetchTasks();
  };

  return (
    <div className="page-wrapper">
      <div className="task-list-page">
        <>
          <h1 className="task-list-page__title">Tasks</h1>
          <p className="task-list-page__subtitle">
            All your tasks in one place
          </p>
        </>

        <div className="task-list-page__actions">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks"
          />

          <div className="task-list-page__actions-buttons">
            <AddButton onClick={openModal} />

            <SortToggleButton
              isNewestFirst={isNewestFirst}
              onToggle={() => setIsNewestFirst(!isNewestFirst)}
            />
          </div>
        </div>

        <div className="task-list-page__list">
          {filteredTasks.map((task) => (
            <TaskListCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              completionToggle={completionToggle}
            />
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Create a new task"
          className={`modal ${isModalOpen ? "modal--open" : ""}`}
          overlayClassName="modal-overlay"
          appElement={document.getElementById("root") || undefined}
        >
          <p className="modal__title">Create a task</p>

          <form className="modal__form" onSubmit={handlecreateTask}>
            <div className="modal__info-wrapper">
              <div className="modal__input-group">
                <input
                  className="modal__input"
                  onChange={(e) => setTaskTitle(e.target.value)}
                  value={taskTitle}
                  type="text"
                  placeholder="Title"
                />
              </div>

              <div className="modal__input-group">
                <textarea
                  className="modal__textarea"
                  onChange={(e) => setTaskContent(e.target.value)}
                  value={taskContent}
                  placeholder="Description"
                />
              </div>

              <div className="modal__input-group">
                <DatePickerInput
                  placeholder="Pick date"
                  value={taskDueDate}
                  onChange={setTaskDueDate}
                />
              </div>

              <div className="modal__button-wrapper">
                <button
                  className="modal__button modal__button--create"
                  disabled={!taskTitle}
                  type="submit"
                >
                  Create Task
                </button>

                <button
                  className="modal__button modal__button--cancel"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default TaskListPage;
