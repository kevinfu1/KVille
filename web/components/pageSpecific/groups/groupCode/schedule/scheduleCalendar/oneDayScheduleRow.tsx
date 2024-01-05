import React, { useContext } from "react";
import { ScheduleAndStartDate } from "../../../../../../../common/src/db/schedule/scheduleAndStartDate";
import { getNumSlotsBetweenDates } from "../../../../../../../common/src/calendarAndDates/datesUtils";
import { Stack } from "@mui/material";
import { ScheduleCell } from "./scheduleCell";
import { useQueryToFetchSchedule } from "../../../../../../lib/pageSpecific/schedule/scheduleHooks";
import { useRouter } from "next/dist/client/router";
import { INVALID_GROUP_CODE } from "../../../../../../../common/src/db/groupExistenceAndMembership/GroupCode";
import { EMPTY } from "../../../../../../../common/src/scheduling/slots/tenterSlot";
import { Typography } from "@material-ui/core";
import { Table, TableBody,TableCell,TableContainer,TableHead,TableRow } from "@material-ui/core";
import { CellColorsCoordinator, OUT_OF_BOUNDS_NAME } from "../cellColorsCoordinator";
import { CellColorsContext } from "@/lib/pageSpecific/schedule/cellColorsContext";
interface OneDayScheduleRowProps {
    rowStartDate : Date;
}



export const OneDayScheduleRow : React.FC<OneDayScheduleRowProps> = (props : OneDayScheduleRowProps) => {
    const router = useRouter();
    const groupCode = router.query.groupCode ? router.query.groupCode.toString() : INVALID_GROUP_CODE;
    const {data : scheduleAndStartDate, isLoading, isError} = useQueryToFetchSchedule(groupCode);

    if (scheduleAndStartDate){   
        return <RowGivenData scheduleAndStartDate={scheduleAndStartDate} rowStartDate={props.rowStartDate}/>
    } else {
        return null
    }  
}


interface RowGivenDataProps {
    scheduleAndStartDate : ScheduleAndStartDate;
    rowStartDate : Date;
}

const dateToTextLabel = (date : Date) : string => {

    let hours = date.getHours();
    let am = hours < 12;
    hours = hours % 12;
    if (hours % 12 === 0){
        hours = 12;
    }
    let minutes = ":00";
    if (date.getMinutes() == 30){
        minutes = ":30";
    }
    let text : string = hours + minutes;
    if (am){
        text += "am";
    } else {
        text += "pm";
    }
    if (text.length == 6){
        text = text;
    }
    return text;

}

export const ROW_PADDING_AND_MARGIN = 4;

const RowGivenData : React.FC<RowGivenDataProps> = (props : RowGivenDataProps) => {
    let scheduleIndex = getNumSlotsBetweenDates(props.scheduleAndStartDate.startDate, props.rowStartDate);
    let {cellColorsCoordinator} = useContext(CellColorsContext);
    let names : string[] = [];
    let inBounds = true;
    if ((scheduleIndex < 0) || (scheduleIndex >= props.scheduleAndStartDate.schedule.length)){
        names = [OUT_OF_BOUNDS_NAME]; 
        inBounds = false;       
    } else {
        names = props.scheduleAndStartDate.getNamesAtTimeIndex(scheduleIndex);
    }
    if (names.length == 0){
        names = [EMPTY];
    }

    let timeLabelTopMargin = "-30px";
    if (props.rowStartDate.getHours() == 0 && props.rowStartDate.getMinutes() == 0){
        timeLabelTopMargin = "-23px";
    }
    return (


        <TableRow style={{height : 20, marginTop : ROW_PADDING_AND_MARGIN, paddingTop : ROW_PADDING_AND_MARGIN, marginLeft : 0, paddingLeft : 0}}>
            <TableCell style={{position : "sticky", left : 0, backgroundColor : "white", maxWidth:"fit-content", width: "1%", opacity : "100%", margin : ROW_PADDING_AND_MARGIN,
            padding : ROW_PADDING_AND_MARGIN,
            height : 20}}>
                <Typography noWrap style={{marginTop: timeLabelTopMargin, textAlign : "right", color : "inherit", opacity : "100%", backgroundColor : "inherit", marginRight : 4, marginLeft : 4}}>
                    {dateToTextLabel(props.rowStartDate)}
                </Typography>
            </TableCell>

            {names.map((name, index) => {
                return (
                    <ScheduleCell 
                    name={name} 
                    startDate={props.rowStartDate} 
                    inBounds={inBounds} 
                    color={cellColorsCoordinator.getColorForNameGivenAllNames(name, props.scheduleAndStartDate.getAllMembers().map(member => member.username))} 
                    key={index}/>
                );
            })}
  
        </TableRow>
    )
}