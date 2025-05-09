import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [behaviors, setBehaviors] = useState([]);
  const [newBehavior, setNewBehavior] = useState("");
  const [editingBehaviorId, setEditingBehaviorId] = useState(null);
  const [editingBehaviorName, setEditingBehaviorName] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemName, setEditingItemName] = useState("");
  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");

  useEffect(() => {
    fetchBehaviors();
  }, []);

  const fetchBehaviors = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/behaviors?userId=${userId}`
    );
    setBehaviors(res.data);
  };

  const addBehavior = async () => {
    if (!newBehavior) return;
    await axios.post("http://localhost:5000/api/behaviors", {
      name: newBehavior,
      userId: userId,
    });
    setNewBehavior("");
    fetchBehaviors();
  };

  const deleteBehavior = async (id) => {
    await axios.delete(`http://localhost:5000/api/behaviors/${id}`);
    fetchBehaviors();
  };

  const editBehavior = async (id, name) => {
    setEditingBehaviorId(id);
    setEditingBehaviorName(name);
  };

  const updateBehavior = async () => {
    if (!editingBehaviorName) return;

    try {
      await axios.put(
        `http://localhost:5000/api/behaviors/${editingBehaviorId}`,
        { name: editingBehaviorName }
      );
      setEditingBehaviorId(null);
      setEditingBehaviorName("");
      fetchBehaviors();
    } catch (error) {
      console.error("Error updating behavior:", error);
    }
  };

  const addItem = async (behaviorId, itemName) => {
    await axios.post(
      `http://localhost:5000/api/behaviors/${behaviorId}/items`,
      { name: itemName }
    );
    fetchBehaviors();
  };

  const deleteItem = async (behaviorId, itemId) => {
    await axios.delete(
      `http://localhost:5000/api/behaviors/${behaviorId}/items/${itemId}`
    );
    fetchBehaviors();
  };

  const editItem = (itemId, itemName) => {
    setEditingItemId(itemId);
    setEditingItemName(itemName);
  };

  const updateItem = async (behaviorId) => {
    if (!editingItemName) return;

    try {
      await axios.put(
        `http://localhost:5000/api/behaviors/items/${editingItemId}`,
        { name: editingItemName }
      );
      setEditingItemId(null);
      setEditingItemName("");
      fetchBehaviors(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    window.location.href = "/";
  };

  return (
    <div
      className="min-h-screen  items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/back.jpg')" }}
    >
  <div className="p-8 max-w-4xl mx-auto bg-gray-100 shadow-lg rounded-lg">
    <div className="flex justify-between items-center mb-8 mt-3">
      <h1 className="text-3xl font-bold">Behavior Management</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
    <h2 className="text-xl mb-4">Welcome, {name}!</h2>

    {/* Behavior form */}
    <div className="mb-6 flex gap-2 flex-col sm:flex-row">
      <input
        value={newBehavior}
        onChange={(e) => setNewBehavior(e.target.value)}
        placeholder="New Behavior"
        className="border px-4 py-2 rounded w-full sm:w-auto"
      />
      <button
        onClick={addBehavior}
        className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
      >
        Add
      </button>
    </div>

    {/* Behavior list container */}
    <div className="max-h-[500px] overflow-y-auto">
      {behaviors.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">No behaviors yet</p>
      ) : (
        behaviors.map((behavior) => (
          <div key={behavior._id} className="border p-4 rounded mb-4 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              {editingBehaviorId === behavior._id ? (
                <div className="flex">
                  <input
                    value={editingBehaviorName}
                    onChange={(e) => setEditingBehaviorName(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    onClick={updateBehavior}
                    className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                  >
                    Update
                  </button>
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <h2 className="text-xl font-semibold">{behavior.bname}</h2>
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => editBehavior(behavior._id, behavior.bname)}
                      className="text-blue-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBehavior(behavior._id)}
                      className="text-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Items */}
            <ul className="list-disc list-inside mb-2">
              {behavior.items.length === 0 ? (
                <p className="text-gray-400">No items yet</p>
              ) : (
                behavior.items.map((item, index) => (
                  <li
                    key={item._id || index}
                    className="flex justify-between items-center"
                  >
                    {editingItemId === item._id ? (
                      <div className="flex gap-2">
                        <input
                          value={editingItemName}
                          onChange={(e) => setEditingItemName(e.target.value)}
                          className="border px-2 py-1 rounded"
                        />
                        <button
                          onClick={() => updateItem(behavior._id)}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Update
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center w-full">
                        {item.name}
                        <div className="ml-auto flex gap-2">
                          <button
                            onClick={() => editItem(item._id, item.name)}
                            className="text-blue-500 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(behavior._id, item._id)}
                            className="text-sm text-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>

            <AddItemForm behaviorId={behavior._id} addItem={addItem} />
          </div>
        ))
      )}
    </div>
  </div>
  </div>
);
};

const AddItemForm = ({ behaviorId, addItem }) => {
  const [itemName, setItemName] = useState("");

  const handleAdd = () => {
    if (!itemName) return;
    addItem(behaviorId, itemName);
    setItemName("");
  };

  return (
    <div className="flex gap-2">
      <input
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="New Item"
        className="border px-2 py-1 rounded w-full"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Add
      </button>
    </div>
  );
};


export default Home;
