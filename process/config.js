module.exports.LAWMAKER_REPLACEMENTS = [
    {district: 'SD 48', note: 'Shane Morigeau appointed to fill seat after Nov. 2020 resignation of Sen. Nate McConnell.'}
]

module.exports.BILL_STATUSES = [
    { key: 'In Drafting Process', step: 'Drafting', label: 'In drafting', status: 'not introduced' },

    // first-house
    { key: 'In First House--Introduced', step: 'First chamber', label: 'Introduced', status: 'live' },
    { key: 'In First House Committee--Nontabled', step: 'First chamber', label: 'In committee', status: 'live' },
    { key: 'In First House Committee--Tabled', step: 'First chamber', label: 'Tabled in committee', status: 'stalled' },
    { key: 'In First House--Out of Committee', step: 'First chamber', label: 'Out of committee', status: 'live' },
    { key: 'In First House--Through 2nd Reading', step: 'First chamber', label: 'Passed second reading vote', status: 'live' },
    { key: 'In First House--Through 3rd Reading', step: 'First chamber', label: 'Passed chamber', status: 'live' },

    // second-house
    { key: 'Transmitted to Second House', step: 'Second chamber', label: 'Transmitted', status: 'live' },
    { key: 'In Second House Committee--Nontabled', step: 'Second chamber', label: 'In committee', status: 'live' },
    { key: 'In Second House Committee--Tabled', step: 'Second chamber', label: 'Tabled', status: 'stalled' },
    { key: 'In Second House--Out of Committee', step: 'Second chamber', label: 'On floor', status: 'live' },
    { key: 'In Second House--Through 2nd Reading', step: 'Second chamber', label: 'Passed 2nd reading vote', status: 'live' },
    { key: 'In Second House--Through 3rd Reading', step: 'Second chamber', label: 'Passed chamber', status: 'live' },

    // reconciliation
    { key: 'Returned to First House with Second House Amendments', step: 'Reconciliation', label: 'In reconciliation', status: 'live' },
    { key: 'In Process to Consider Second House Amendments', step: 'Reconciliation', label: 'In reconciliation', status: 'live' },
    { key: 'In Conference or Free Conference Committee Process', step: 'Reconciliation', label: 'In reconciliation', status: 'live' },

    // Passed Legislature
    { key: 'Passed By Legislature--Enrolling and Final Preparation Process', step: 'Through Legislature', label: 'Passed both chambers', status: 'live' },

    // governor's desk
    { key: 'Transmitted to Governor', step: 'Governor', label: 'Before governor', status: 'live' },
    { key: 'Returned With Governor\'s Proposed Amendments or Line Item Veto', step: 'Governor', label: 'Changes suggested', status: 'live' },
    { key: 'In Process to Consider Governor\'s Proposed Amendments or Line Item Veto', step: 'Governor', label: 'Changes suggested', status: 'live' },
    { key: 'In Process to Attempt Override of Governor \'s Veto', step: 'Governor', label: 'Veto override attempt', status: 'live' },

    // Final markers --> complicate things
    { key: 'Probably Dead', label: 'Probably Dead', step: 'Failed', status: 'stalled' },
    { key: 'Became Law', label: 'Became Law', step: 'Passed', status: 'became-law' },
    
]

// Display flags
const isMajor = true
const isHighlight = true

// Resolution flags

// Bill progression flags
const introduction = true
const sentToCommittee = true
const sentToSecondChamber = true
const sentToGovernor = true

const firstCommitteePassage = true
const firstCommitteeFailed = true
const secondCommitteePassage = true // second chamber committee
const secondCommitteeFailed = true

const committeeTabled = true
const committeeUntabled = true

const missedDeadline = true

const blastMotionPassage = true
const firstChamberPassage = true
const firstChamberFailure = true
const secondChamberPassage = true
const secondChamberFailure = true
const signedByGovernor = true
const vetoedByGovernor = true

const ultimatelyFailed = true
const ultimatelyPassed = true

module.exports.ACTIONS = [
    // omitting {flag: false} fields here for clarity
    
    // highlight actions
    { key: 'Introduced', isMajor, isHighlight, introduction},

    // RESOLUTION-SPECIFIC
    // Resolution commitee actions
    { key: 'Committee Executive Action--Resolution Adopted', isMajor, isHighlight, firstCommitteePassage},
    { key: 'Committee Executive Action--Resolution Adopted as Amended', isMajor, isHighlight, firstCommitteePassage},
    // Resolutuon floor actions
    { key: 'Resolution Adopted', isMajor, isHighlight},

    // general committee actions
    { key: 'Tabled in Committee', isMajor, isHighlight, committeeTabled},
    { key: 'Taken from Table in Committee', isMajor, committeeUntabled},
    { key: 'Committee Vote Failed; Remains in Committee', isMajor, },
    { key: 'Reconsidered Previous Action; Remains in Committee', isMajor,},

    // first house committee actions
    { key: 'Committee Executive Action--Bill Passed', isMajor, isHighlight, firstCommitteePassage},
    { key: 'Committee Executive Action--Bill Passed as Amended', isMajor, isHighlight, firstCommitteePassage},
    { key: 'Committee Executive Action--Bill Not Passed', isMajor, isHighlight, firstCommitteeFailed},

    // second house committee actions
    { key: 'Committee Executive Action--Bill Concurred', isMajor, isHighlight, secondCommitteePassage, },
    { key: 'Committee Executive Action--Bill Concurred as Amended', isMajor, isHighlight, secondCommitteePassage, },
    { key: 'Committee Executive Action--Bill Not Concurred', isMajor, isHighlight, secondCommitteeFailed, },

    // first house floor votes
    { key: '2nd Reading Passed', isMajor, isHighlight, },
    { key: '2nd Reading Not Passed', isMajor, isHighlight, },
    { key: '2nd Reading Not Passed as Amended', isMajor, isHighlight, firstChamberFailure},
    { key: '2nd Reading Pass as Amended Motion Failed', isMajor, },
    { key: '2nd Reading Pass Motion Failed', isMajor, firstChamberFailure},
    { key: '2nd Reading Passed as Amended', isMajor, isHighlight, },
    { key: '3rd Reading Passed', isMajor, isHighlight, firstChamberPassage},

    // second house floor votes
    { key: '2nd Reading Concurred', isMajor, isHighlight, },
    { key: '2nd Reading Not Concurred', isMajor, isHighlight, secondChamberFailure, },
    { key: '2nd Reading Concurred as Amended', isMajor, isHighlight, },
    { key: '2nd Reading Concur Motion Failed', isMajor, secondChamberFailure, },
    { key: '2nd Reading Concur as Amended Motion Failed', isMajor, secondChamberFailure, },
    { key: '3rd Reading Concurred', isMajor, isHighlight, secondChamberPassage},

    // amendment votes
    { key: '2nd Reading Motion to Amend Carried', isMajor, },
    { key: '2nd Reading Motion to Amend Failed', isMajor, },

    // either house floor votes
    { key: '3rd Reading Failed', isMajor, isHighlight, },
    { key: '2nd Reading Indefinitely Postponed', isMajor, },

    // Reconciliation votes
    { key: '2nd Reading Senate Amendments Concurred', isMajor, },
    { key: '2nd Reading Senate Amendments Not Concurred', isMajor, },
    { key: '2nd Reading House Amendments Concurred', isMajor, },
    { key: '2nd Reading House Amendments Not Concurred', isMajor, },
    { key: '3rd Reading Passed as Amended by House', isMajor, },
    { key: '3rd Reading Passed as Amended by Senate', isMajor, },
    { key: '2nd Reading Conference Committee Report Adopted', isMajor, },
    { key: '2nd Reading Free Conference Committee Report Adopted', isMajor, },
    { key: "2nd Reading Governor's Proposed Amendments Adopted", isMajor, },
    { key: "2nd Reading Governor's Proposed Amendments Not Adopted", isMajor, },
    { key: '3rd Reading Conference Committee Report Adopted', isMajor, },
    { key: '3rd Reading Conference Committee Report Rejected', isMajor, },
    { key: '3rd Reading Free Conference Committee Report Adopted', isMajor, },
    { key: "3rd Reading Governor's Proposed Amendments Adopted", isMajor, },
    
    // Blast motions
    { key: 'Taken from Committee; Placed on 2nd Reading', isMajor, isHighlight, blastMotionPassage},

    // Other major votes
    { key: 'Motion Carried', isMajor, },
    { key: 'Motion Failed', isMajor, },
    { key: 'Motion to Reconsider Failed', isMajor, },
    { key: 'On Motion Rules Suspended', isMajor, },
    { key: 'Reconsidered Previous Action; Placed on 2nd Reading', isMajor, },
    { key: 'Reconsidered Previous Action; Remains in 2nd Reading Process', isMajor, },
    { key: 'Reconsidered Previous Action; Remains in 3rd Reading Process', isMajor, },
    { key: 'Rules Suspended to Accept Late Return of Amended Bill', isMajor, },
    { key: 'Segregated from Committee of the Whole Report', isMajor, },
    { key: 'Taken from 2nd Reading; Rereferred to Committee', isMajor, },
    
    // Transmittal milestones
    { key: 'Transmitted to House', isMajor, sentToSecondChamber},
    { key: 'Transmitted to Senate', isMajor, sentToSecondChamber},
    { key: 'Transmitted to Governor', isMajor, sentToGovernor},

    // Major w/out votes
    { key: 'Hearing', isMajor, },

    // Committee referrals
    { key: 'Referred to Committee', isMajor, sentToCommittee},
    { key: 'Rereferred to Committee', isMajor, },
    
    // Other major, no votes expected
    { key: 'First Reading', isMajor, },
    { key: 'Bill Not Heard at Sponsor\'s Request', isMajor, },
    { key: 'Bill Withdrawn per House Rule H30-50(3)(b)', isMajor, },
    { key: 'Taken from 3rd Reading; Placed on 2nd Reading', isMajor, },
    { key: 'Returned to House', isMajor, },
    { key: 'Returned to Senate', isMajor, },
    { key: 'Returned to House with Amendments', isMajor, },
    { key: 'Returned to Senate with Amendments', isMajor, },
    { key: 'Returned with Governor\'s Proposed Amendments', isMajor, },
    { key: 'Transmitted to Senate for Consideration of Governor\'s Proposed Amendments', isMajor, },
    { key: 'Transmitted to House for Consideration of Governor\'s Proposed Amendments', isMajor, },
    { key: 'Returned to Senate Concurred in Governor\'s Proposed Amendments', isMajor, },
    { key: 'Returned to Senate Not Concurred in Governor\'s Proposed Amendments', isMajor, },
    { key: 'Returned to House Concurred in Governor\'s Proposed Amendments', isMajor, },
    { key: 'Returned to House Not Concurred in Governor\'s Proposed Amendments', isMajor, },
    { key: 'Rules Suspended to Accept Late Transmittal of Bill', isMajor, },
    
    // Governor
    { key: 'Vetoed by Governor', isMajor, isHighlight, vetoedByGovernor,},
    { key: 'Signed by Governor', isMajor, isHighlight, signedByGovernor,},
    { key: 'Veto Override Vote Mail Poll in Progress', isMajor, },
    { key: 'Veto Override Failed in Legislature', isMajor, },

    // Deadlines
    { key: 'Missed Deadline for General Bill Transmittal', isMajor, missedDeadline},
    { key: 'Missed Deadline for Revenue Bill Transmittal', isMajor, missedDeadline},
    { key: 'Missed Deadline for Revenue Estimating Resolution Transmittal', isMajor, missedDeadline},

    // Ultimate outcomes
    { key: 'Died in Standing Committee', isMajor, ultimatelyFailed},
    { key: 'Died in Process', isMajor, ultimatelyFailed},
    { key: 'Chapter Number Assigned', isMajor, ultimatelyPassed},
    { key: 'Filed with Secretary of State', isMajor, ultimatelyPassed},
    
    // conference committees
    { key: 'Free Conference Committee Appointed', isMajor, },
    { key: 'Free Conference Committee Report Received', isMajor, },
    { key: 'Conference Committee Appointed', isMajor, },
    { key: 'Conference Committee Report Received', isMajor, },
    

    // Minor actions (exclude from default bill table view)
    { key: 'Draft Back for Redo', },
    { key: 'Draft Back for Requester Changes', },
    { key: 'Draft Delivered to Requester', },
    { key: 'Draft On Hold', },
    { key: 'Draft Ready for Delivery', },
    { key: 'Draft Request Received', },
    { key: 'Draft Taken Off Hold', },
    { key: 'Draft Taken by Drafter', },
    { key: 'Draft in Assembly', },
    { key: 'Draft in Edit', },
    { key: 'Draft in Final Drafter Review', },
    { key: 'Draft in Input/Proofing', },
    { key: 'Draft in Legal Review', },
    { key: 'Draft to Drafter - Edit Review [CMD]', },
    { key: 'Draft to Drafter - Edit Review [KWK]', },
    { key: 'Draft to Drafter - Edit Review [SMH]', },
    { key: 'Draft to Requester for Review', },
    { key: 'Executive Director Final Review', },
    { key: 'Executive Director Review', },
    { key: 'Fiscal Note Printed', },
    { key: 'Fiscal Note Probable', },
    { key: 'Fiscal Note Received', },
    { key: 'Fiscal Note Requested', },
    { key: 'Fiscal Note Requested (Local Government Fiscal Impact)', },
    { key: 'Fiscal Note Signed', },
    { key: 'Fiscal Note Unsigned', },
    { key: 'Pre-Introduction Letter Sent', },
    { key: 'Printed - Enrolled Version Available', },
    { key: 'Printed - New Version Available', },
    { key: 'Returned from Enrolling', },
    { key: 'Revised Fiscal Note Printed', },
    { key: 'Revised Fiscal Note Received', },
    { key: 'Revised Fiscal Note Requested', },
    { key: 'Revised Fiscal Note Signed', },
    { key: 'Scheduled for 2nd Reading', },
    { key: '2nd Reading Pass Consideration'},
    { key: 'Scheduled for 3rd Reading', },
    { key: '3rd Reading Pass Consideration'},
    { key: 'Scheduled for Executive Action', },
    { key: 'Sent to Enrolling', },
    { key: 'Signed by Speaker', },
    { key: 'Signed by President', },
    { key: 'Sponsor List Modified', },
    { key: 'Sponsor Rebuttal to Fiscal Note Printed', },
    { key: 'Sponsor Rebuttal to Fiscal Note Received', },
    { key: 'Sponsor Rebuttal to Fiscal Note Requested', },
    { key: 'Sponsor Rebuttal to Fiscal Note Signed', },
    { key: 'Sponsors Engrossed', },
    { key: 'Legal Review Note', },
    { key: 'Bill Draft Text Available Electronically', },
    { key: 'Introduced Bill Text Available Electronically', },
    { key: 'Clerical Corrections Made - New Version Available', },   
    { key: 'Veto Override Vote Mail Poll Letter Being Prepared', },
    { key: 'Conference Committee Dissolved', },
    { key: 'Free Conference Committee Dissolved', },
    { key: 'Special Note', },
    { key: 'Committee Report--Resolution Adopted', },
    { key: 'Committee Report--Bill Not Passed', },
    { key: 'Committee Report--Bill Not Concurred', },
    { key: 'Committee Report--Bill Passed', },
    { key: 'Committee Report--Bill Passed as Amended', },
    { key: 'Committee Report--Bill Concurred as Amended', },
    { key: 'Committee Report--Bill Concurred', },
    { key: 'Committee Report--Resolution Adopted as Amended', },
    { key: 'Adverse Committee Report Adopted', },
    { key: 'Hearing Canceled', },
    { key: 'Amendments Available', },
    { key: 'Draft Canceled', },


]