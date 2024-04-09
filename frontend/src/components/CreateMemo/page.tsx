import { useNavigate } from "react-router-dom";

import Header from "../Header/header";
import MemoForm from "./components/MemoForm/memoForm";

import { MemoController } from "../../controllers/memo.controller";
import { MemoType } from "../../models/memo";

import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";

const CreateMemo = ({}) => {
  const navigate = useNavigate();
  const { currentUser } = useFirebaseAuth();

  const handleSubmit = async ( name:string, description:string, locationName:string, coordinates:[number,number] ) => {
    console.log(coordinates);
    const memoToCreate: MemoType = {
      name: name,
      date: new Date().toLocaleString(),
      location: {
        name: locationName,
        coordinates: coordinates,
      },
      description: description,
    };

    try {
      await MemoController.create_memo(currentUser.uid, memoToCreate);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating memo:", error);
    }
  };

  return (
    <main className="create-memo w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header />
      <h2 className="text-3xl font-bold mb-6 mt-6 text-blue-800">Creating New Memo</h2>
      <MemoForm onSubmit={handleSubmit} default_name={""} default_description={""}/>
    </main>
  );
};

export default CreateMemo;
