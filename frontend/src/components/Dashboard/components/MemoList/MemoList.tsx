import MemoItem from "../MemoItem/MemoItem";

const MemoList = (props:{
        memos:[], 
        handleDeleteMemo:(memo:any,event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, 
        locationName:string 
    }) => {
  return (
    <div className="memo-box">
      {props.memos.map((memo, index) => (
        <MemoItem key={index} memo={memo} handleDeleteMemo={props.handleDeleteMemo} locationName={props.locationName}/>
      ))}
    </div>
  );
};

export default MemoList;
