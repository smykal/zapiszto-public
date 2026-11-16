import React, { Component } from 'react';
import GetExercise from './GetExercise';


type Props = {
    workbook_id: number,
    training_id: number,
    userId: number
}

class Exercise extends Component<Props> {
    constructor(props: Props) {
        super(props) 
    }
    
    render() {
        const { training_id, userId } = this.props;

        return (
            <div>
                <GetExercise training_id={training_id} userId={userId}></GetExercise>
            </div>
        )
        
    }
}

export default Exercise;