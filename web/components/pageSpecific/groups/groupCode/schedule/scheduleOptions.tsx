import React, {useContext, useState}  from "react";
import { KvilleAccordion } from "@/components/shared/utils/accordion";
import { Typography } from "@material-ui/core";
import {Container} from "@material-ui/core";
import { DatesRow } from "./datesRow";
import { DateRangeChanger } from "@/components/shared/dateRangeChanger/dateRangeChanger";
import {getDefaultAssignDateRangeStartDate, getDefaultAssignDateRangeEndDate, validateAssignTentersDateRange} from "../../../../../../common/src/frontendLogic/schedule/assignTenters";
import { ScheduleAndStartDate } from "../../../../../../common/src/db/schedule/scheduleAndStartDate";
import { useMutationToAssignTentersAndUpdateSchedule, useQueryToFetchSchedule } from "../../../../../lib/pageSpecific/schedule/scheduleHooks";
import { useRouter } from "next/router";
import { INVALID_GROUP_CODE } from "../../../../../../common/src/db/groupExistenceAndMembership/GroupCode";
import { KvilleLoadingCircle } from "@/components/shared/utils/loading";
import { getScheduleDates, CURRENT_YEAR } from "../../../../../../common/src/scheduling/rules/scheduleDates";
import { GroupContext } from "@/lib/shared/context/groupContext";
import { ErrorMessage } from "@/components/shared/utils/errorMessage";



export const ScheduleOptions : React.FC = () => {
    const router = useRouter();
    const groupCode = router.query.groupCode ? router.query.groupCode.toString() : INVALID_GROUP_CODE;
    const {data : scheduleAndStartDate, isLoading} = useQueryToFetchSchedule(groupCode);
    const {groupDescription} = useContext(GroupContext);
    const [badDateRangeMsg, setBadDateRangeMsg] = useState<string>("");

    const {mutate : runAlgoAndUpdateScheduleInDB, isError : isErrorCreatingNewSchedule, isLoading : isCreatingNewScheduleAndUpdatingDB, successMsg } = useMutationToAssignTentersAndUpdateSchedule(groupCode);
    
    const getDefinedScheduleAndStartDate = () : ScheduleAndStartDate => {
        if (scheduleAndStartDate){
            return scheduleAndStartDate;
        } else {
            return new ScheduleAndStartDate([], getScheduleDates(CURRENT_YEAR).startOfBlack, new Map());
        }
    }



    let assignTentersOption = {
        summaryText : "Fill In Schedule",
        detail : 
            <Container>
                <Typography align="left" style={{marginBottom: 16}}>
                    Our algorithm will fill in your schedule between these times. Make sure everyone in your group has filled in their availability for the dates selected below!
                </Typography>
                <DateRangeChanger 
                    includeHours={true}
                    externalStartDate={getDefaultAssignDateRangeStartDate(getDefinedScheduleAndStartDate())}
                    externalEndDate={getDefaultAssignDateRangeEndDate(getDefinedScheduleAndStartDate())}
                    submitNewDateRange={(startDate : Date, endDate : Date) => {
                        let {successful, message} = validateAssignTentersDateRange(startDate, endDate, getDefinedScheduleAndStartDate().startDate);
                        if (successful) {
                            let data = getDefinedScheduleAndStartDate();
                            runAlgoAndUpdateScheduleInDB({startDate, endDate, tentType : groupDescription.tentType, oldSchedule : data});
                        } else  {
                            setBadDateRangeMsg(message);
                            setTimeout(() => {
                                setBadDateRangeMsg("");
                            }, 3000);
                        }
                    }}
                />
                {(isCreatingNewScheduleAndUpdatingDB) ? <Typography align="center"><KvilleLoadingCircle/></Typography> : null}
                {isErrorCreatingNewSchedule ? <Typography align="center" style={{color : "red"}}>An Error Occurred</Typography> : null}
                {badDateRangeMsg.length > 1 ? <ErrorMessage msg={badDateRangeMsg}/> : null}
                {successMsg.length > 1 ? <Typography align="center">{successMsg}</Typography> : null}
            </Container>
    }
    
    return (
        <Container maxWidth="md" style={{marginTop: 12}}>
            <Container maxWidth="sm">
                <KvilleAccordion elements={[assignTentersOption]} />
            </Container>
            <DatesRow/>
        </Container>
    );
}