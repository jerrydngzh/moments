import MemoItem from "../MemoItem/MemoItem";

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
      {props.expanded && (
        <div className="memo-box">
            {props.memos.map((memo, index) => (
                <MemoItem key={index} memo={memo} handleDeleteMemo={props.handleDeleteMemo} locationName={props.locationName}/>
            ))}
        </div>
    )}
    </div>
  );
};

export default LocationItem;
