import AddProfessor from "../../components/Addprofessor";
import AddSubject from "../../components/AddSubject";
import React, {useState, useEffect} from 'react';
import ScheduleClass from "../../components/ScheduleMeet";



function CourForm () {

  const [reloadData, setReloadData] = useState(false);
  const handleProfessorAdded = () => setReloadData(!reloadData);
  const handleSubjectAdded = () => setReloadData(!reloadData);

  return (
    <>

      <div className="Cour">
        <h2 className="Titre">Planifiez les cours</h2>
          <AddProfessor onProfessorAdded={handleProfessorAdded}/>
          <AddSubject onSubjectAdded={handleSubjectAdded}/>
          <ScheduleClass/>
          
      </div>
      
      
    </>
  )


}

export default CourForm;