import { useEffect, useState } from 'react';
import Task from "../../components/task/Task";
import "./TaskPage.scss";
import { db } from '../../firebase/firebase';
import {
    query,
    collection,
    onSnapshot,
    updateDoc, doc, addDoc,
    deleteDoc
} from 'firebase/firestore';

//! undefined "n" errors? Check the if the info being passed into a function is correct. This has happened twicxe with 2 functiions inside the task.tsx component

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const q = query(collection(db, "tasks"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tasksArray = [];
            querySnapshot.forEach((doc) => {
                tasksArray.push({ ...doc.data(), id: doc.id });
            });
            setTasks(tasksArray);
        });
        return () => unsubscribe();
    }, []);

    const createTask = async (event) => {
        event.preventDefault();

        if (input === "") {
            alert("Please enter a task");
            return;
        }

        await addDoc(collection(db, "tasks"), {
            title: input,
            completion: false,
            creationDate: new Date().toISOString(),
        });
        setInput("");
        console.log("Task created");
    };

    const completionToggle = async (task) => {
        await updateDoc(doc(db, "tasks", task.id), {
            completion: !task.completion,
        });
        console.log("Task completion toggled");
    };

    const deleteTask = async (task) => {
        console.log("Deleting task:", task);
        await deleteDoc(doc(db, "tasks", task.id));
        console.log("Deleted with id:", task.id);
    };

    return (

        <div className="section">

            <div className="taskpage">

                <div className="taskpage__header">

                    <h1 className="taskpage__title text-3xl">Your tasks</h1>

                    <form className="taskpage__form" onSubmit={createTask}>
                        <input className="taskpage__form-input" type="text" placeholder="Add task" value={input} onChange={(event) => setInput(event.target.value)} />
                        <button className="taskpage__form-button"><i className="ri-add-line"></i></button>
                    </form>

                </div>

                <div className="taskpage__content">

                    <ul className="taskpage__task-list">

                        {tasks.map((task) => (
                            <Task key={task.id} task={task} completionToggle={completionToggle} deleteTask={deleteTask} />
                        ))}

                    </ul>

                    <div className="taskpage__stats">

                        <div className="taskpage__stats-item">
                            <h2 className="text-2xl">Total tasks</h2>
                            <p className="text-2xl">{tasks.length}</p>
                        </div>

                        <div className="taskpage__stats-item">
                            <h2 className="text-2xl">Completed tasks</h2>
                            <p className="text-2xl">0</p>
                        </div>

                        <div className="taskpage__stats-item">
                            <h2 className="text-2xl">Pending tasks</h2>
                            <p className="text-2xl">{tasks.length}</p>
                        </div>

                    </div>

                </div>

            </div>

        </div >

    );
};

export default TaskPage;

