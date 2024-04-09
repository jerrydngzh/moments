import MemoList from "../MemoList/MemoList";

const LocationItem = (props:{ 
    locationName:string,
    expanded:boolean,
    handleLocationClick:(locationName:string) => void,
    memos:[],
    handleDeleteMemo:(memo:any,event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}
    ) => {
  return (
    <div className="location-box" onClick={() => props.handleLocationClick(props.locationName)}>
      <h3>{props.locationName}</h3>
      {props.expanded && <MemoList memos={props.memos} handleDeleteMemo={props.handleDeleteMemo} locationName={props.locationName}/>}
    </div>
  );
};

export default LocationItem;
