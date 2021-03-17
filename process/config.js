module.exports.startOfToday = new Date(new Date().setHours(-7, 0, 0, 0)) // -7 is time zone fudge factor

module.exports.LAWMAKER_REPLACEMENTS = [
    { district: 'SD 48', note: 'Shane Morigeau appointed to fill seat after Nov. 2020 resignation of Sen. Nate McConnell.' }
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
const draftRequest = true
const draftReady = true
const introduction = true
const sentToCommittee = true
const sentToSecondChamber = true
const sentToGovernor = true

const hearing = true
const committeeVote = true
const firstCommitteePassage = true
const firstCommitteeFailed = true
const secondCommitteePassage = true // second chamber committee
const secondCommitteeFailed = true

const committeeTabled = true
const committeeUntabled = true
const committeeFailed = true
const committeePassed = true

const withdrawn = true
const missedDeadline = true

const secondReading = true
const thirdReading = true
const resolutionVote = true // since these are only voted on once?

const blastMotionPassage = true
const firstChamberInitialPassage = true
const firstChamberPassage = true
const firstChamberFailure = true
const secondChamberInitialPassage = true
const secondChamberAmendments = true
const secondChamberPassage = true
const secondChamberFailure = true
const signedByGovernor = true
const vetoedByGovernor = true


const resolutionAdopted = true
const resolutionFailed = true

const ultimatelyFailed = true
const ultimatelyPassed = true

module.exports.ACTIONS = [
    // omitting {flag: false} fields here for clarity

    // highlight actions
    { key: 'Introduced', isMajor, isHighlight, introduction, },

    // RESOLUTION-SPECIFIC
    // Resolution commitee actions
    { key: 'Committee Executive Action--Resolution Adopted', isMajor, isHighlight, committeeVote, committeePassed, firstCommitteePassage },
    { key: 'Committee Executive Action--Resolution Adopted as Amended', isMajor, isHighlight, committeeVote, committeePassed, firstCommitteePassage },
    { key: 'Committee Executive Action--Resolution Not Adopted', isMajor, isHighlight, committeeVote, committeeFailed, firstCommitteeFailed },
    { key: 'Committee Executive Action--Resolution Not Adopted as Amended', isMajor, isHighlight, committeeVote, committeeFailed, firstCommitteeFailed },

    // Resolution floor actions
    { key: 'Resolution Adopted', isMajor, isHighlight, ultimatelyPassed, resolutionVote, resolutionAdopted, firstChamberPassage, secondChamberPassage },
    { key: 'Resolution Not Adopted', isMajor, isHighlight, resolutionVote, resolutionFailed },
    { key: 'Adverse Committee Report Adopted', isMajor, isHighlight, resolutionVote, resolutionFailed }, // Seems to be how resolutions are killed?

    // general committee actions
    { key: 'Tabled in Committee', isMajor, isHighlight, committeeVote, committeeTabled, committeeVote },
    { key: 'Taken from Table in Committee', isMajor, committeeVote, committeeUntabled, committeeVote },
    { key: 'Committee Vote Failed; Remains in Committee', isMajor, committeeVote },
    { key: 'Reconsidered Previous Action; Remains in Committee', isMajor, committeeVote },

    // first house committee actions
    { key: 'Committee Executive Action--Bill Passed', isMajor, isHighlight, committeeVote, committeePassed, firstCommitteePassage },
    { key: 'Committee Executive Action--Bill Passed as Amended', isMajor, isHighlight, committeeVote, committeePassed, firstCommitteePassage },
    { key: 'Committee Executive Action--Bill Not Passed', isMajor, isHighlight, committeeVote, committeeFailed, firstCommitteeFailed },

    // second house committee actions
    { key: 'Committee Executive Action--Bill Concurred', isMajor, isHighlight, committeeVote, committeePassed, secondCommitteePassage, },
    { key: 'Committee Executive Action--Bill Concurred as Amended', isMajor, isHighlight, committeeVote, committeePassed, secondCommitteePassage, secondChamberAmendments },
    { key: 'Committee Executive Action--Bill Not Concurred', isMajor, isHighlight, committeeVote, committeeFailed, secondCommitteeFailed, },

    // first house floor votes
    { key: '2nd Reading Passed', isMajor, isHighlight, secondReading, firstChamberInitialPassage },
    { key: '2nd Reading Not Passed', isMajor, isHighlight, secondReading, firstChamberFailure },
    { key: '2nd Reading Not Passed as Amended', isMajor, isHighlight, secondReading, firstChamberFailure },
    { key: '2nd Reading Pass as Amended Motion Failed', isMajor, secondReading, firstChamberFailure },
    { key: '2nd Reading Pass Motion Failed', isMajor, secondReading, firstChamberFailure },
    { key: '2nd Reading Passed as Amended', isMajor, isHighlight, secondReading, firstChamberInitialPassage },
    { key: '3rd Reading Passed', isMajor, isHighlight, thirdReading, firstChamberPassage },
    // 2005 session
    { key: '2nd Reading Passed as Amended on Voice Vote', isMajor, isHighlight, secondReading, firstChamberInitialPassage },
    { key: '2nd Reading Passed on Voice Vote', isMajor, isHighlight, secondReading, firstChamberInitialPassage },
    { key: 'Placed on Consent Calendar', isMajor, isHighlight, secondReading, firstChamberInitialPassage },


    // second house floor votes
    { key: '2nd Reading Concurred', isMajor, isHighlight, secondReading, secondChamberInitialPassage },
    { key: '2nd Reading Not Concurred', isMajor, isHighlight, secondReading, secondChamberFailure, },
    { key: '2nd Reading Concurred as Amended', isMajor, isHighlight, secondReading, secondChamberInitialPassage, secondChamberAmendments },
    { key: '2nd Reading Concur Motion Failed', isMajor, secondReading, secondChamberFailure, },
    { key: '2nd Reading Concur as Amended Motion Failed', isMajor, secondReading, secondChamberFailure, },
    { key: '3rd Reading Concurred', isMajor, isHighlight, thirdReading, secondChamberPassage },
    // 2005 session
    { key: '2nd Reading Concurred on Voice Vote', isMajor, isHighlight, secondReading, secondChamberInitialPassage },
    { key: '2nd Reading Concurred as Amended on Voice Vote', isMajor, isHighlight, secondReading, secondChamberInitialPassage },

    // amendment votes
    { key: '2nd Reading Motion to Amend Carried', isMajor, },
    { key: '2nd Reading Motion to Amend Failed', isMajor, },

    // either house floor votes
    { key: '3rd Reading Failed', isMajor, isHighlight, thirdReading },
    { key: '2nd Reading Indefinitely Postponed', isMajor, },

    // Reconciliation votes
    { key: '2nd Reading Senate Amendments Concurred', isMajor, isHighlight },
    { key: '2nd Reading Senate Amendments Not Concurred', isMajor, isHighlight },
    { key: '2nd Reading House Amendments Concurred', isMajor, isHighlight },
    { key: '2nd Reading House Amendments Not Concurred', isMajor, isHighlight },
    { key: '3rd Reading Passed as Amended by House', isMajor, isHighlight },
    { key: '3rd Reading Passed as Amended by Senate', isMajor, isHighlight },
    { key: '2nd Reading Conference Committee Report Adopted', isMajor, },
    { key: '2nd Reading Free Conference Committee Report Adopted', isMajor, },
    { key: "2nd Reading Governor's Proposed Amendments Adopted", isMajor, },
    { key: "2nd Reading Governor's Proposed Amendments Not Adopted", isMajor, },
    { key: '3rd Reading Conference Committee Report Adopted', isMajor, },
    { key: '3rd Reading Conference Committee Report Rejected', isMajor, },
    { key: '3rd Reading Free Conference Committee Report Adopted', isMajor, },
    { key: "3rd Reading Governor's Proposed Amendments Adopted", isMajor, },

    // Blast motions
    { key: 'Taken from Committee; Placed on 2nd Reading', isMajor, isHighlight, blastMotionPassage },

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


    // Transmittal milestones
    { key: 'Transmitted to House', isMajor, sentToSecondChamber },
    { key: 'Transmitted to Senate', isMajor, sentToSecondChamber },
    { key: 'Transmitted to Governor', isMajor, sentToGovernor },

    // Major w/out votes
    { key: 'Hearing', isMajor, hearing },

    // Committee referrals
    { key: 'Referred to Committee', isMajor, sentToCommittee },
    { key: 'Rereferred to Committee', isMajor, sentToCommittee },
    { key: 'Taken from 2nd Reading; Rereferred to Committee', isMajor, sentToCommittee },

    // Other major, no votes expected
    { key: 'First Reading', isMajor, introduction },
    { key: 'Bill Not Heard at Sponsor\'s Request', isMajor, withdrawn },
    { key: 'Bill Withdrawn per House Rule H30-50(3)(b)', isMajor, withdrawn },
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
    { key: 'Vetoed by Governor', isMajor, isHighlight, vetoedByGovernor, },
    { key: 'Signed by Governor', isMajor, isHighlight, signedByGovernor, },
    { key: 'Veto Override Vote Mail Poll in Progress', isMajor, },
    { key: 'Veto Override Failed in Legislature', isMajor, },

    // Deadlines
    { key: 'Missed Deadline for General Bill Transmittal', isMajor, missedDeadline },
    { key: 'Missed Deadline for Revenue Bill Transmittal', isMajor, missedDeadline },
    { key: 'Missed Deadline for Revenue Estimating Resolution Transmittal', isMajor, missedDeadline },

    // Ultimate outcomes
    { key: 'Died in Standing Committee', isMajor, ultimatelyFailed },
    { key: 'Died in Process', isMajor, ultimatelyFailed },
    { key: 'Chapter Number Assigned', isMajor, ultimatelyPassed },
    { key: 'Filed with Secretary of State', isMajor, ultimatelyPassed },

    // conference committees
    { key: 'Free Conference Committee Appointed', isMajor, },
    { key: 'Free Conference Committee Report Received', isMajor, },
    { key: 'Conference Committee Appointed', isMajor, },
    { key: 'Conference Committee Report Received', isMajor, },


    // Minor actions (exclude from default bill table view)

    // committee reports

    { key: 'Draft Request Received', draftRequest },
    { key: 'Bill Draft Text Available Electronically', draftReady },
    { key: 'Draft Delivered to Requester' },
    { key: 'Draft Back for Redo', },
    { key: 'Draft Back for Requester Changes', },
    { key: 'Draft On Hold', },
    { key: 'Draft Ready for Delivery', },
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
    { key: 'Fiscal Note Received (Local Government Fiscal Impact)', },
    { key: 'Fiscal Note Signed (Local Government Fiscal Impact)', },
    { key: 'Fiscal Note Printed (Local Government Fiscal Impact)', },
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
    { key: '2nd Reading Pass Consideration' },
    { key: '2nd Reading Indefinitely Postpone Motion Failed' },
    { key: 'Scheduled for 3rd Reading', },
    { key: '3rd Reading Pass Consideration' },
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
    { key: 'Introduced Bill Text Available Electronically', },
    { key: 'Clerical Corrections Made - New Version Available', },
    { key: 'Veto Override Vote Mail Poll Letter Being Prepared', },
    { key: 'Conference Committee Dissolved', },
    { key: 'Free Conference Committee Dissolved', },
    { key: 'Special Note', },
    { key: 'Hearing Canceled', },
    { key: 'Amendments Available', },
    { key: 'Draft Canceled', },
    // Committee reports redundant w/ Executive Action
    // flagged here for reasons
    { key: 'Committee Report--Resolution Adopted', committeePassed },
    { key: 'Committee Report--Bill Not Passed', committeeFailed },
    { key: 'Committee Report--Bill Not Concurred', committeeFailed },
    { key: 'Committee Report--Bill Passed', committeePassed },
    { key: 'Committee Report--Bill Passed as Amended', committeePassed },
    { key: 'Committee Report--Bill Concurred as Amended', committeePassed },
    { key: 'Committee Report--Bill Concurred', committeePassed },
    { key: 'Committee Report--Resolution Adopted as Amended', committeePassed },
    { key: 'Committee Report--Resolution Not Adopted', committeeFailed },


]

module.exports.NAME_CLEANING = {
    // Standardizes various lawmaker name permutations presented in LAWS

    // 2019 Senate
    'Ankney, Duane': 'Duane Ankney',
    'Fitzpatrick, Steve': 'Steve Fitzpatrick',
    'Malek, Sue': 'Sue Malek',
    'Sesso, Jon': 'Jon Sesso',
    'Sesso, Jon C.': 'Jon Sesso',
    'Jon C Sesso': 'Jon Sesso',
    'Barrett, Dick': 'Dick Barrett',
    'Flowers, Pat': 'Pat Flowers',
    'McClafferty, Edith': 'Edie McClafferty',
    'McClafferty, Edith (Edie)': 'Edie McClafferty',
    'Edith (Edie) McClafferty': 'Edie McClafferty',
    'Small, Jason': 'Jason Small',
    'Small, Jason D.': 'Jason Small',
    'Jason D Small': 'Jason Small',
    'Bennett, Bryce': 'Bryce Bennett',
    'Gauthier, Terry': 'Terry Gauthier',
    'McConnell, Nate': 'Nate McConnell',
    'Smith, Cary': 'Cary Smith',
    'Blasdel, Mark': 'Mark Blasdel',
    'Gillespie, Bruce': 'Bruce Gillespie',
    'McNally, Mary': 'Mary McNally',
    'Smith, Frank': 'Frank Smith',
    'Bogner, Kenneth': 'Kenneth Bogner',
    'Gross, Jen': 'Jen Gross',
    'Olszewski, Albert': 'Albert Olszewski',
    'Tempel, Russel': 'Russ Tempel',
    'Tempel, Russel (Russ)': 'Russ Tempel',
    'Russel (Russ) Tempel': 'Russ Tempel',
    'Boland, Carlie': 'Carlie Boland',
    'Hinebauch, Steve': 'Steve Hinebauch',
    'Osmundson, Ryan': 'Ryan Osmundson',
    'Thomas, Fred': 'Fred Thomas',
    'Brown, Dee': 'Dee Brown',
    'Hoven, Brian': 'Brian Hoven',
    'Phillips, Mike': 'Mike Phillips',
    'Vance, Gordon': 'Gordon Vance',
    'Cohenour, Jill': 'Jill Cohenour',
    'Howard, David': 'David Howard',
    'Pomnichowski, JP': 'JP Pomnichowski',
    'Vuckovich, Gene': 'Gene Vuckovich',
    'Cuffe, Mike': 'Mike Cuffe',
    'Jacobson, Tom': 'Tom Jacobson',
    'Regier, Keith': 'Keith Regier',
    'Webb, Roger': 'Roger Webb',
    'Ellis, Janet': 'Janet Ellis',
    'Kary, Douglas': 'Doug Kary',
    'Kary, Douglas (Doug)': 'Doug Kary',
    'Douglas (Doug) Kary': 'Doug Kary',
    'Richmond, Tom': 'Tom Richmond',
    'Webber, Susan': 'Susan Webber',
    'Ellsworth, Jason': 'Jason Ellsworth',
    'Ellsworth, Jason W.': 'Jason Ellsworth',
    'Jason W Ellsworth': 'Jason Ellsworth',
    'Keenan, Bob': 'Bob Keenan',
    'Sales, Scott': 'Scott Sales',
    'Welborn, Jeffery': 'Jeff Welborn',
    'Welborn, Jeffrey W.': 'Jeff Welborn',
    'Jeffery W Welborn': 'Jeff Welborn',
    'Jeffrey W Welborn': 'Jeff Welborn',
    'Welborn, Jeffrey': 'Jeff Welborn',
    'Esp, John': 'John Esp',
    'Lang, Mike': 'Mike Lang',
    'Salomon, Daniel': 'Dan Salomon',
    'Salomon, Daniel R.': 'Dan Salomon',
    'Daniel R Salomon': 'Dan Salomon',
    'Fielder, Jennifer': 'Jennifer Fielder',
    'MacDonald, Margaret': 'Margie MacDonald',
    'MacDonald, Margaret (Margie)': 'Margie MacDonald',
    'Margaret (Margie) MacDonald': 'Margie MacDonald',
    'Sands, Diane': 'Diane Sands',

    // 2019 House
    'Abbott, Kim': 'Kim Abbott',
    'Farris-Olsen, Robert': 'Robert Farris-Olsen',
    'Keogh, Connie': 'Connie Keogh',
    'Redfield, Alan': 'Alan Redfield',
    'Anderson, Fred': 'Fred Anderson',
    'Fern, Dave': 'Dave Fern',
    'Kerr-Carpenter, Emma': 'Emma Kerr-Carpenter',
    'Regier, Matt': 'Matt Regier',
    'Bachmeier, Jacob': 'Jacob Bachmeier',
    'Fitzgerald, Ross': 'Ross Fitzgerald',
    'Fitzgerald, Ross H.': 'Ross Fitzgerald',
    'Ross H Fitzgerald': 'Ross Fitzgerald',
    'Knudsen, Rhonda': 'Rhonda Knudsen',
    'Ricci, Vince': 'Vince Ricci',
    'Bahr, Jade': 'Jade Bahr',
    'Fleming, Frank': 'Frank Fleming',
    'Knudsen, Casey': 'Casey Knudsen',
    'Running Wolf, Tyson': 'Tyson Running Wolf',
    'Runningwolf, Tyson T.': 'Tyson Running Wolf',
    'Tyson T Running Wolf': 'Tyson Running Wolf',
    'Running Wolf, Tyson T.': 'Tyson Running Wolf',
    'Ballance, Nancy': 'Nancy Ballance',
    'Fuller, John': 'John Fuller',
    'Krautter, Joel': 'Joel Krautter',
    'Krautter, Joel G.': 'Joel Krautter',
    'Joel G Krautter': 'Joel Krautter',
    'Ryan, Marilyn': 'Marilyn Ryan',
    'Bartel, Dan': 'Dan Bartel',
    'Funk, Moffie': 'Moffie Funk',
    'Krotkov, Jasmine': 'Jasmine Krotkov',
    'Sales, Walt': 'Walt Sales',
    'Beard, Becky': 'Becky Beard',
    'Galt, Wylie': 'Wylie Galt',
    'Lenz, Dennis': 'Dennis Lenz',
    'Lenz, Dennis R.': 'Dennis Lenz',
    'Dennis R Lenz': 'Dennis Lenz',
    'Schreiner, Casey': 'Casey Schreiner',
    'Bedey, David': 'David Bedey',
    'Garcia, Rodney': 'Rodney Garcia',
    'Loge, Denley': 'Denley Loge',
    'Loge, Denley M.': 'Denley Loge',
    'Denley M Loge': 'Denley Loge',
    'Shaw, Ray': 'Ray Shaw',
    'Shaw, Ray L.': 'Ray Shaw',
    'Ray L Shaw': 'Ray Shaw',
    'Berglee, Seth': 'Seth Berglee',
    'Garner, Frank': 'Frank Garner',
    'Lynch, Ryan': 'Ryan Lynch',
    'Sheldon-Galloway, Lola': 'Lola Sheldon-Galloway',
    'Galloway, Lola': 'Lola Sheldon-Galloway',
    'Bessette, Barbara': 'Barbara Bessette',
    'Glimm, Carl': 'Carl Glimm',
    'Mandeville, Forrest': 'Forrest Mandeville',
    'Skees, Derek': 'Derek Skees',
    'Bishop, Laurie': 'Laurie Bishop',
    'Greef, Sharon': 'Sharon Greef',
    'Manzella, Theresa': 'Theresa Manzella',
    'Smith, Bridget': 'Bridget Smith',
    'Brown, Bob': 'Bob Brown',
    'Grubbs, Bruce': 'Bruce Grubbs',
    'Marler, Marilyn': 'Marilyn Marler',
    'Stewart Peregoy, Sharon': 'Sharon Stewart Peregoy',
    'Brown, Zach': 'Zach Brown',
    'Gunderson, Steve': 'Steve Gunderson',
    'McKamey, Wendy': 'Wendy McKamey',
    'Sullivan, Katie': 'Katie Sullivan',
    'Burnett, Tom': 'Tom Burnett',
    'Hamilton, Jim': 'Jim Hamilton',
    'Mercer, Bill': 'Bill Mercer',
    'Sweeney, Mark': 'Mark Sweeney',
    'Buttrey, Edward': 'Ed Buttrey',
    'Edward Buttrey': 'Ed Buttrey',
    'Hamlett, Bradley': 'Bradley Hamlett',
    'Moore, Frederick': 'Eric Moore',
    'Moore, Frederick (Eric)': 'Eric Moore',
    'Frederick (Eric) Moore': 'Eric Moore',
    'Tschida, Brad': 'Brad Tschida',
    'Caferro, Mary': 'Mary Caferro',
    'Harvey, Derek': 'Derek Harvey',
    'Harvey, Derek J.': 'Derek Harvey',
    'Derek J Harvey': 'Derek Harvey',
    'Moore, Terry': 'Terry Moore',
    'Usher, Barry': 'Barry Usher',
    'Curdy, Willis': 'Willis Curdy',
    'Hayman, Denise': 'Denise Hayman',
    'Morigeau, Shane': 'Shane Morigeau',
    'Morigeau, Shane A.': 'Shane Morigeau',
    'Shane A Morigeau': 'Shane Morigeau',
    'Vinton, Sue': 'Sue Vinton',
    'Custer, Geraldine': 'Geraldine Custer',
    'Hertz, Greg': 'Greg Hertz',
    'Mortensen, Dale': 'Dale Mortensen',
    'Weatherwax, Marvin': 'Marvin Weatherwax',
    'DeVries, Greg': 'Greg DeVries',
    'Holmlund, Kenneth': 'Kenneth Holmlund',
    'Holmlund, Kenneth L.': 'Kenneth Holmlund',
    'Kenneth L Holmlund': 'Kenneth Holmlund',
    'Noland, Mark': 'Mark Noland',
    'Webb, Peggy': 'Peggy Webb',
    'Doane, Alan': 'Alan Doane',
    'Hopkins, Mike': 'Mike Hopkins',
    'Olsen, Andrea': 'Andrea Olsen',
    'Welch, Tom': 'Tom Welch',
    'Dooling, Julie': 'Julie Dooling',
    'Jones, Llew': 'Llew Jones',
    'Peppers, Rae': 'Rae Peppers',
    'White, Kerry': 'Kerry White',
    'Dudik, Kimberly': 'Kim Dudik',
    'Kimberly Dudik': 'Kim Dudik',
    'Karjala, Jessica': 'Jessica Karjala',
    'Perry, Zac': 'Zac Perry',
    'Windy Boy, Jonathan': 'Jonathan Windy Boy',
    'Dunn, David': 'David Dunn',
    'Kassmier, Joshua': 'Josh Kassmier',
    'Joshua Kassmier': 'Josh Kassmier',
    'Pierson, Gordon': 'Gordon Pierson',
    'Winter, Thomas': 'Tom Winter',
    'Thomas Winter': 'Tom Winter',
    'Dunwell, Mary Ann': 'Mary Ann Dunwell',
    'Keane, Jim': 'Jim Keane',
    'Pope, Christopher': 'Chris Pope',
    'Christopher Pope': 'Chris Pope',
    'Woods, Tom': 'Tom Woods',
    'Duram, Neil': 'Neil Duram',
    'Kelker, Kathy': 'Kathy Kelker',
    'Read, Joe': 'Joe Read',
    'Zolnikov, Daniel': 'Daniel Zolnikov',

    // New in 2021
    'Bertoglio, Marta': 'Marta Bertoglio',
    'Binkley, Michele': 'Michele Binkley',
    'Boldman, Ellie': 'Ellie Boldman',
    'Brewster, Larry': 'Larry Brewster',
    'Buckley, Alice': 'Alice Buckley',
    'Carlson, Jennifer': 'Jennifer Carlson',
    'Fielder, Paul': 'Paul Fielder',
    'Fox, Mike': 'Mike Fox',
    'France, Tom': 'Tom France',
    'Frazer, Gregory': 'Gregory Frazer',
    'Friedel, Chris': 'Chris Friedel',
    'Galloway, Steven': 'Steven Galloway',
    'Gillette, Jane': 'Jane Gillette',
    'Gist, Steve': 'Steve Gist',
    'Hawk, Donavon': 'Donavon Hawk',
    'Hill, Ed': 'Ed Hill',
    'Hinkle, Jedediah': 'Jedediah Hinkle',
    'Hinkle, Caleb': 'Caleb Hinkle',
    'Kerns, Scot': 'Scot Kerns',
    'Kortum, Kelly': 'Kelly Kortum',
    'Ler, Brandon': 'Brandon Ler',
    'Malone, Marty': 'Marty Malone',
    'Marshall, Ron': 'Ron Marshall',
    'McGillvray, Tom': 'Tom McGillvray',
    'Mitchell, Braxton': 'Braxton Mitchell',
    'Molnar, Brad': 'Brad Molnar',
    'Nave, Fiona': 'Fiona Nave',
    'Novak, Sara': 'Sara Novak',
    'O\'Brien, Shannon': 'Shannon O\'Brien',
    'Patelis, Jimmy': 'Jimmy Patelis',
    'Phalen, Bob': 'Bob Phalen',
    'Putnam, Brian': 'Brian Putnam',
    'Regier, Amy': 'Amy Regier',
    'Reksten, Linda': "Linda Reksten",
    '<skip>, Linda': "Linda Reksten", // Is this a bad idea?
    'Schillinger, Jerry': "Jerry Schillinger",
    'Seekins-Crowe, Kerri': "Kerri Seekins-Crowe",
    'Stafman, Ed': "Ed Stafman",
    'Stromswold, Mallerie': "Mallerie Stromswold",
    'Tenenbaum, Danny': "Danny Tenenbaum",
    'Thane, Mark': "Mark Thane",
    'Trebas, Jeremy': "Jeremy Trebas",
    'Walsh, Kenneth': "Kenneth Walsh",
    'Whitman, Kathy': 'Kathy Whitman',
    'Whiteman Pena, Rynalea': 'Rynalea Whiteman Pena',
    'Zolnikov, Katie': 'Katie Zolnikov',
}

module.exports.LAST_NAMES = {
    'Mark Noland': 'Noland',
    'Tom Richmond': 'Richmond',
    'Mary McNally': 'McNally',
    'Jasmine Krotkov': 'Krotkov',
    'Wylie Galt': 'Galt',
    'JP Pomnichowski': 'Pomnichowski',
    'Marilyn Ryan': 'Ryan',
    'Jessica Karjala': 'Karjala',
    'Peggy Webb': 'Webb',
    'Barry Usher': 'Usher',
    'Sharon Stewart Peregoy': 'Peregoy',
    'Robert Farris-Olsen': 'Farris-Olsen',
    'Daniel Zolnikov': 'Zolnikov',
    'Vince Ricci': 'Ricci',
    'Dan Bartel': 'Bartel',
    'Nate McConnell': 'McConnell',
    'Kathy Kelker': 'Kelker',
    'Tom Jacobson': 'Jacobson',
    'Katie Sullivan': 'Sullivan',
    'Ed Buttrey': 'Buttrey',
    'Walt Sales': 'Sales',
    'Jim Keane': 'Keane',
    'Kenneth Bogner': 'Bogner',
    'Jason Ellsworth': 'Ellsworth',
    'Terry Moore': 'Moore',
    'Fred Thomas': 'Thomas',
    'Ryan Lynch': 'Lynch',
    'Llew Jones': 'Jones',
    'Janet Ellis': 'Ellis',
    'Margie MacDonald': 'MacDonald',
    'Gene Vuckovich': 'Vuckovich',
    'Derek Harvey': 'Harvey',
    'Sue Vinton': 'Vinton',
    'Mike Hopkins': 'Hopkins',
    'Tom Woods': 'Woods',
    'Rhonda Knudsen': 'Knudsen',
    'Matt Regier': 'Regier',
    'Frank Garner': 'Garner',
    'Sue Malek': 'Malek',
    'Ray Shaw': 'Shaw',
    'Mark Sweeney': 'Sweeney',
    'Greg Hertz': 'Hertz',
    'Scott Sales': 'Sales',
    'Jonathan Windy Boy': 'Windy Boy',
    'Dale Mortensen': 'Mortensen',
    'Andrea Olsen': 'Olsen',
    'John Fuller': 'Fuller',
    'Diane Sands': 'Sands',
    'Steve Hinebauch': 'Hinebauch',
    'Duane Ankney': 'Ankney',
    'Brad Tschida': 'Tschida',
    'Chris Pope': 'Pope',
    'Dick Barrett': 'Barrett',
    'Bob Keenan': 'Keenan',
    'Bruce Grubbs': 'Grubbs',
    'Geraldine Custer': 'Custer',
    'Laurie Bishop': 'Bishop',
    'Bruce Gillespie': 'Gillespie',
    'Jennifer Fielder': 'Fielder',
    'Ross Fitzgerald': 'Fitzgerald',
    'Becky Beard': 'Beard',
    'Kim Abbott': 'Abbott',
    'Dan Salomon': 'Salomon',
    'Mark Blasdel': 'Blasdel',
    'Jeff Welborn': 'Welborn',
    'Steve Gunderson': 'Gunderson',
    'Julie Dooling': 'Dooling',
    'Bryce Bennett': 'Bennett',
    'Jen Gross': 'Gross',
    'Russ Tempel': 'Tempel',
    'David Bedey': 'Bedey',
    'Tom Burnett': 'Burnett',
    'Bradley Hamlett': 'Hamlett',
    'Kenneth Holmlund': 'Holmlund',
    'Jacob Bachmeier': 'Bachmeier',
    'Terry Gauthier': 'Gauthier',
    'Emma Kerr-Carpenter': 'Kerr-Carpenter',
    'Kim Dudik': 'Dudik',
    'Barbara Bessette': 'Bessette',
    'Albert Olszewski': 'Olszewski',
    'Theresa Manzella': 'Manzella',
    'Shane Morigeau': 'Morigeau',
    'Bill Mercer': 'Mercer',
    'Frank Fleming': 'Fleming',
    'Mike Cuffe': 'Cuffe',
    'David Howard': 'Howard',
    'Zac Perry': 'Perry',
    'Josh Kassmier': 'Kassmier',
    'Derek Skees': 'Skees',
    'Alan Redfield': 'Redfield',
    'Roger Webb': 'Webb',
    'Casey Schreiner': 'Schreiner',
    'Carl Glimm': 'Glimm',
    'Willis Curdy': 'Curdy',
    'Brian Hoven': 'Hoven',
    'Seth Berglee': 'Berglee',
    'Zach Brown': 'Brown',
    'David Dunn': 'Dunn',
    'Denley Loge': 'Loge',
    'Carlie Boland': 'Boland',
    'Mike Lang': 'Lang',
    'Jade Bahr': 'Bahr',
    'Bridget Smith': 'Smith',
    'Joel Krautter': 'Krautter',
    'Pat Flowers': 'Flowers',
    'Jason Small': 'Small',
    'Steve Fitzpatrick': 'Fitzpatrick',
    'Doug Kary': 'Kary',
    'Dee Brown': 'Brown',
    'Fred Anderson': 'Anderson',
    'Forrest Mandeville': 'Mandeville',
    'Jon Sesso': 'Sesso',
    'Marvin Weatherwax': 'Weatherwax',
    'Tyson Running Wolf': 'Running Wolf',
    'Rodney Garcia': 'Garcia',
    'Neil Duram': 'Duram',
    'Gordon Pierson': 'Pierson',
    'Connie Keogh': 'Keogh',
    'Tom Welch': 'Welch',
    'Mike Phillips': 'Phillips',
    'Jill Cohenour': 'Cohenour',
    'Cary Smith': 'Smith',
    'Frank Smith': 'Smith',
    'Denise Hayman': 'Hayman',
    'Jim Hamilton': 'Hamilton',
    'Wendy McKamey': 'McKamey',
    'Dennis Lenz': 'Lenz',
    'John Esp': 'Esp',
    'Mary Ann Dunwell': 'Dunwell',
    'Joe Read': 'Read',
    'Casey Knudsen': 'Knudsen',
    'Lola Sheldon-Galloway': 'Sheldon-Galloway',
    'Moffie Funk': 'Funk',
    'Susan Webber': 'Webber',
    'Keith Regier': 'Regier',
    'Eric Moore': 'Moore',
    'Edie McClafferty': 'McClafferty',
    'Greg DeVries': 'DeVries',
    'Rae Peppers': 'Peppers',
    'Alan Doane': 'Doane',
    'Ryan Osmundson': 'Osmundson',
    'Kerry White': 'White',
    'Dave Fern': 'Fern',
    'Sharon Greef': 'Greef',
    'Gordon Vance': 'Vance',
    'Bob Brown': 'Brown',
    'Mary Caferro': 'Caferro',
    'Nancy Ballance': 'Ballance',
    'Tom Winter': 'Winter',
    'Marilyn Marler': 'Marler',
    'Larry Brewster': 'Brewster',
    'Debo Powers': 'Powers',
    'Katie Zolnikov': 'Zolnikov',

    // New lawmakers in 2021
    'Marta Bertoglio': 'Bertoglio',
    'Michele Binkley': 'Binkley',
    'Ellie Boldman': 'Boldman',
    'Alice Buckley': 'Buckley',
    'Jennifer Carlson': 'Carlson',
    'Paul Fielder': 'Fielder',
    'Mike Fox': 'Fox',
    'Tom France': 'France',
    'Gregory Frazer': 'Frazer',
    'Chris Friedel': 'Friedel',
    'Steven Galloway': 'Galloway',
    'Jane Gillette': 'Gillette',
    'Steve Gist': 'Gist',
    'Donavon Hawk': 'Hawk',
    'Ed Hill': 'Hill',
    'Jedediah Hinkle': 'Hinkle',
    'Caleb Hinkle': 'Hinkle',
    'Scot Kerns': 'Kerns',
    'Kelly Kortum': 'Kortum',
    'Brandon Ler': 'Ler',
    'Marty Malone': 'Malone',
    'Ron Marshall': 'Marshall',
    'Tom McGillvray': 'McGillvray',
    'Braxton Mitchell': 'Mitchell',
    'Brad Molnar': 'Molnar',
    'Fiona Nave': 'Nave',
    'Sara Novak': 'Novak',
    'Shannon O\'Brien': "O'Brien",
    'Jimmy Patelis': 'Patelis',
    'Bob Phalen': 'BPhalen',
    'Brian Putnam': 'Putnam',
    'Amy Regier': 'Regier',
    "Linda Reksten": "Reksten",
    "Jerry Schillinger": "Schillinger",
    "Kerri Seekins-Crowe": "Seekins-Crowe",
    "Ed Stafman": "Stafman",
    "Mallerie Stromswold": "Stromswold",
    "Danny Tenenbaum": "Tenenbaum",
    "Mark Thane": "Thane",
    "Jeremy Trebas": "Trebas",
    "Kenneth Walsh": 'Walsh',
    'Kathy Whitman': 'Whitman',
    'Rynalea Whiteman Pena': 'Whiteman Pena',
}

module.exports.COMMITTEES = [
    // HOUSE
    { name: 'House Appropriations', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal', },

    { name: 'House Business and Labor', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { name: 'House Judiciary', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { name: 'House Taxation', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { name: 'House State Administration', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { name: 'House Human Services', daysOfWeek: 'daily', time: '3 p.m.', type: 'policy', },

    { name: 'House Natural Resources', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { name: 'House Transportation', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { name: 'House Education', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { name: 'House Energy, Technology and Federal Relations', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },

    { name: 'House Agriculture', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { name: 'House Fish, Wildlife and Parks', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { name: 'House Local Government', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },

    { name: 'House Rules', daysOfWeek: 'on call', time: '', type: 'policy', },
    { name: 'House Ethics', daysOfWeek: 'on call', time: '', type: 'policy', suppress: true },
    { name: 'House Legislative Administration', daysOfWeek: 'on call', time: '', type: 'policy', },

    { name: 'House Joint Appropriations Subcommittee on General Government', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal', },
    { name: 'House Joint Approps Subcom on Judicial Branch, Law Enforcement, and Justice', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal', },
    { name: 'House Joint Appropriations Subcommittee on Natural Resources and Transportation', daysOfWeek: 'daily', time: ' 8:30 a.m.', type: 'fiscal', },
    { name: 'House Joint Appropriations Subcommittee on Education', daysOfWeek: 'daily', time: '8:30 a.m.', type: 'fiscal', },
    { name: 'House Joint Appropriations Subcommittee on Long-Range Planning', daysOfWeek: 'daily', time: '8:30 a.m.', type: 'fiscal', },
    { name: 'House Joint Appropriations Subcommittee on Health and Human Services', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal', },
    { name: 'House Select Committee on HB 632', daysOfWeek: 'on call', time: '', type: 'fiscal', }, // 2021 covid stimulus committee
    // SENATE
    { name: 'Senate Finance and Claims', daysOfWeek: 'daily', time: '8 a.m.', type: 'fiscal', },

    { name: 'Senate Business, Labor, and Economic Affairs', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },
    { name: 'Senate Judiciary', daysOfWeek: 'daily', time: '9 a.m.', type: 'policy', },
    { name: 'Senate Taxation', daysOfWeek: 'daily', time: '8 a.m.', type: 'policy', },

    { name: 'Senate Education and Cultural Resources', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { name: 'Senate Local Government', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { name: 'Senate Natural Resources', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { name: 'Senate Public Health, Welfare and Safety', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },
    { name: 'Senate State Administration', daysOfWeek: 'M/W/F', time: '3 p.m.', type: 'policy', },

    { name: 'Senate Agriculture, Livestock and Irrigation', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { name: 'Senate Energy and Telecommunications', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { name: 'Senate Fish and Game', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },
    { name: 'Senate Highways and Transportation', daysOfWeek: 'T/Th', time: '3 p.m.', type: 'policy', },

    { name: 'Senate Committee on Committees', daysOfWeek: 'on call', time: '', type: 'special', suppress: true },
    { name: 'Senate Ethics', daysOfWeek: 'on call', time: '', type: 'special', suppress: true },
    { name: 'Senate Rules', daysOfWeek: 'on call', time: '', type: 'special', },
    { name: 'Senate Legislative Administration', daysOfWeek: 'on call', time: '', type: 'special', }
]

module.exports.FINANCE_COMMITTEES = ['Senate Finance and Claims', 'House Appropriations']