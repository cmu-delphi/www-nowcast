/*!
* ILY Nearby | Influenza-like Illness Nearby
* @authors:
    David Farrow, PhD | Computational Biology Department | Carnegie Mellon University
    Roberto Iriondo | Machine Learning Department, Carnegie Mellon University
    Bryan Learn | Pittsburgh Supercomputing Center | Computer Science Department, Carnegie Mellon University
    Delphi Research Group | Carnegie Mellon University
* @author-url: https://delphi.midas.cs.cmu.edu/
* @copyright: Delphi Research Group | Carnegie Mellon University | All Rights Reserved
* @description: Data visualization web application that uses machine learning, data analytics,
*               and crowd-sourcing methods to generate geographically detailed real-time
*               estimates (nowcasts) of influenza-like-illness in the United States.
* @acknowledgements:
*               Map application powered by Leaflet - a library for interactive maps.
*               https://leafletjs.com - (c) Vladimir Agafonkin | http://agafonkin.com/en
*
*               Data visualization powered by D3.JS - a library for data visualization in javascript.
*               https://d3js.org/ - (c) Mike Bostock | https://bost.ocks.org/mike/
*
*               Map custom tiles provided by Thundersforest API
*               Thunderforest is a project by Gravitystorm Limited | https://www.thunderforest.com/contact/
*
*               ILI Nearby uses jQuery, jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license
*
*               Icons use: Font Awesome 4.6.3 by @davegandy - http://fontawesome.io - @fontawesome
*               License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
*/

//"use strict";
/* Start Debugging */
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function.");
    }
}

//TODO: The following var is having bugs when being called.
var nonInfluenzaWeekData;
/* End Debugging */

/*
* Define Constants
*/

var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var NATIONAL = ["nat"];
var HHS_REGIONS = ["hhs1", "hhs2", "hhs3", "hhs4", "hhs5", "hhs6", "hhs7", "hhs8", "hhs9", "hhs10"];
var CENSUS_REGIONS = ["cen1", "cen2", "cen3", "cen4", "cen5", "cen6", "cen7", "cen8", "cen9"];
var REGIONS = HHS_REGIONS.concat(CENSUS_REGIONS);
var STATES = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA","PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
//Add cities
var CITIES=["Albuquerque_NM","Arlington_TX","Atlanta_GA","Austin_TX","Baltimore_MD","Boston_MA","Charlotte_NC","Chicago_IL","Cleveland_OH","Colorado_Springs_CO","Columbus_OH","Dallas_TX","Denver_CO","Detroit_MI","El_Paso_TX","Fort_Worth_TX","Fresno_CA","Houston_TX","Indianapolis_IN","Jacksonville_FL","Kansas_City_MO","Las_Vegas_NV","Long_Beach_CA","Los_Angeles_CA","Louisville_Jefferson_County_KY","Memphis_TN","Mesa_AZ","Miami_FL","Milwaukee_WI","Minneapolis_MN","Nashville_Davidson_TN","New_Orleans_LA","New_York_NY","Oakland_CA","Oklahoma_City_OK","Omaha_NE","Philadelphia_PA","Phoenix_AZ","Pittsburgh_PA","Portland_OR","Raleigh_NC","Sacramento_CA","San_Antonio_TX","San_Diego_CA","San_Francisco_CA","San _Jose_CA","Seattle_WA","Tucson_AZ","Tulsa_OK","Virginia_Beach_VA","Washington_DC","Wichita_KS"];
//Add counties
var COUNTIES=["Autauga County","Baldwin County","Barbour County","Bibb County","Blount County","Bullock County","Butler County","Calhoun County","Chambers County","Cherokee County","Chilton County","Choctaw County","Clarke County","Clay County","Cleburne County","Coffee County","Colbert County","Conecuh County","Coosa County","Covington County","Crenshaw County","Cullman County","Dale County","Dallas County","DeKalb County","Elmore County","Escambia County","Etowah County","Fayette County","Franklin County","Geneva County","Greene County","Hale County","Henry County","Houston County","Jackson County","Jefferson County","Lamar County","Lauderdale County","Lawrence County","Lee County","Limestone County","Lowndes County","Macon County","Madison County","Marengo County","Marion County","Marshall County","Mobile County","Monroe County","Montgomery County","Morgan County","Perry County","Pickens County","Pike County","Randolph County","Russell County","St. Clair County","Shelby County","Sumter County","Talladega County","Tallapoosa County","Tuscaloosa County","Walker County","Washington County","Wilcox County","Winston County","Eastern District","Apache County","Cochise County","Coconino County","Gila County","Graham County","Greenlee County","La Paz County","Maricopa County","Mohave County","Navajo County","Pima County","Pinal County","Santa Cruz County","Yavapai County","Yuma County","Arkansas County","Ashley County","Baxter County","Benton County","Boone County","Bradley County","Calhoun County","Carroll County","Chicot County","Clark County","Clay County","Cleburne County","Cleveland County","Columbia County","Conway County","Craighead County","Crawford County","Crittenden County","Cross County","Dallas County","Desha County","Drew County","Faulkner County","Franklin County","Fulton County","Garland County","Grant County","Greene County","Hempstead County","Hot Spring County","Howard County","Independence County","Izard County","Jackson County","Jefferson County","Johnson County","Lafayette County","Lawrence County","Lee County","Lincoln County","Little River County","Logan County","Lonoke County","Madison County","Marion County","Miller County","Mississippi County","Monroe County","Montgomery County","Nevada County","Newton County","Ouachita County","Perry County","Phillips County","Pike County","Poinsett County","Polk County","Pope County","Prairie County","Pulaski County","Randolph County","St. Francis County","Saline County","Scott County","Searcy County","Sebastian County","Sevier County","Sharp County","Stone County","Union County","Van Buren County","Washington County","White County","Woodruff County","Yell County","Alameda County","Alpine County","Amador County","Butte County","Calaveras County","Colusa County","Contra Costa County","Del Norte County","El Dorado County","Fresno County","Glenn County","Humboldt County","Imperial County","Inyo County","Kern County","Kings County","Lake County","Lassen County","Los Angeles County","Madera County","Marin County","Mariposa County","Mendocino County","Merced County","Modoc County","Mono County","Monterey County","Napa County","Nevada County","Orange County","Placer County","Plumas County","Riverside County","Sacramento County","San Benito County","San Bernardino County","San Diego County","San Francisco, City and County","San Joaquin County","San Luis Obispo County","San Mateo County","Santa Barbara County","Santa Clara County","Santa Cruz County","Shasta County","Sierra County","Siskiyou County","Solano County","Sonoma County","Stanislaus County","Sutter County","Tehama County","Trinity County","Tulare County","Tuolumne County","Ventura County","Yolo County","Yuba County","Adams County","Alamosa County","Arapahoe County","Archuleta County","Baca County","Bent County","Boulder County","Broomfield, City and County","Chaffee County","Cheyenne County","Clear Creek County","Conejos County","Costilla County","Crowley County","Custer County","Delta County","Denver, City and County","Dolores County","Douglas County","Eagle County","Elbert County","El Paso County","Fremont County","Garfield County","Gilpin County","Grand County","Gunnison County","Hinsdale County","Huerfano County","Jackson County","Jefferson County","Kiowa County","Kit Carson County","Lake County","La Plata County","Larimer County","Las Animas County","Lincoln County","Logan County","Mesa County","Mineral County","Moffat County","Montezuma County","Montrose County","Morgan County","Otero County","Ouray County","Park County","Phillips County","Pitkin County","Prowers County","Pueblo County","Rio Blanco County","Rio Grande County","Routt County","Saguache County","San Juan County","San Miguel County","Sedgwick County","Summit County","Teller County","Washington County","Weld County","Yuma County","Fairfield County","Hartford County","Litchfield County","Middlesex County","New Haven County","New London County","Tolland County","Windham County","Kent County","New Castle County","Sussex County","District of Columbia","Alachua County","Baker County","Bay County","Bradford County","Brevard County","Broward County","Calhoun County","Charlotte County","Citrus County","Clay County","Collier County","Columbia County","DeSoto County","Dixie County","Duval County","Escambia County","Flagler County","Franklin County","Gadsden County","Gilchrist County","Glades County","Gulf County","Hamilton County","Hardee County","Hendry County","Hernando County","Highlands County","Hillsborough County","Holmes County","Indian River County","Jackson County","Jefferson County","Lafayette County","Lake County","Lee County","Leon County","Levy County","Liberty County","Madison County","Manatee County","Marion County","Martin County","Miami-Dade County","Monroe County","Nassau County","Okaloosa County","Okeechobee County","Orange County","Osceola County","Palm Beach County","Pasco County","Pinellas County","Polk County","Putnam County","St. Johns County","St. Lucie County","Santa Rosa County","Sarasota County","Seminole County","Sumter County","Suwannee County","Taylor County","Union County","Volusia County","Wakulla County","Walton County","Washington County","Appling County","Atkinson County","Bacon County","Baker County","Baldwin County","Banks County","Barrow County","Bartow County","Ben Hill County","Berrien County","Bibb County","Bleckley County","Brantley County","Brooks County","Bryan County","Bulloch County","Burke County","Butts County","Calhoun County","Camden County","Candler County","Carroll County","Catoosa County","Charlton County","Chatham County","Chattahoochee County","Chattooga County","Cherokee County","Clarke County","Clay County","Clayton County","Clinch County","Cobb County","Coffee County","Colquitt County","Columbia County","Cook County","Coweta County","Crawford County","Crisp County","Dade County","Dawson County","Decatur County","DeKalb County","Dodge County","Dooly County","Dougherty County","Douglas County","Early County","Echols County","Effingham County","Elbert County","Emanuel County","Evans County","Fannin County","Fayette County","Floyd County","Forsyth County","Franklin County","Fulton County","Gilmer County","Glascock County","Glynn County","Gordon County","Grady County","Greene County","Gwinnett County","Habersham County","Hall County","Hancock County","Haralson County","Harris County","Hart County","Heard County","Henry County","Houston County","Irwin County","Jackson County","Jasper County","Jeff Davis County","Jefferson County","Jenkins County","Johnson County","Jones County","Lamar County","Lanier County","Laurens County","Lee County","Liberty County","Lincoln County","Long County","Lowndes County","Lumpkin County","McDuffie County","McIntosh County","Macon County","Madison County","Marion County","Meriwether County","Miller County","Mitchell County","Monroe County","Montgomery County","Morgan County","Murray County","Muscogee County","Newton County","Oconee County","Oglethorpe County","Paulding County","Peach County","Pickens County","Pierce County","Pike County","Polk County","Pulaski County","Putnam County","Quitman County","Rabun County","Randolph County","Richmond County","Rockdale County","Schley County","Screven County","Seminole County","Spalding County","Stephens County","Stewart County","Sumter County","Talbot County","Taliaferro County","Tattnall County","Taylor County","Telfair County","Terrell County","Thomas County","Tift County","Toombs County","Towns County","Treutlen County","Troup County","Turner County","Twiggs County","Union County","Upson County","Walker County","Walton County","Ware County","Warren County","Washington County","Wayne County","Webster County","Wheeler County","White County","Whitfield County","Wilcox County","Wilkes County","Wilkinson County","Worth County","Guam","Hawaii County","Honolulu, City and County","Kalawao County","Kauai County","Maui County","Ada County","Adams County","Bannock County","Bear Lake County","Benewah County","Bingham County","Blaine County","Boise County","Bonner County","Bonneville County","Boundary County","Butte County","Camas County","Canyon County","Caribou County","Cassia County","Clark County","Clearwater County","Custer County","Elmore County","Franklin County","Fremont County","Gem County","Gooding County","Idaho County","Jefferson County","Jerome County","Kootenai County","Latah County","Lemhi County","Lewis County","Lincoln County","Madison County","Minidoka County","Nez Perce County","Oneida County","Owyhee County","Payette County","Power County","Shoshone County","Teton County","Twin Falls County","Valley County","Washington County","Adams County","Alexander County","Bond County","Boone County","Brown County","Bureau County","Calhoun County","Carroll County","Cass County","Champaign County","Christian County","Clark County","Clay County","Clinton County","Coles County","Cook County","Crawford County","Cumberland County","DeKalb County","De Witt County","Douglas County","DuPage County","Edgar County","Edwards County","Effingham County","Fayette County","Ford County","Franklin County","Fulton County","Gallatin County","Greene County","Grundy County","Hamilton County","Hancock County","Hardin County","Henderson County","Henry County","Iroquois County","Jackson County","Jasper County","Jefferson County","Jersey County","Jo Daviess County","Johnson County","Kane County","Kankakee County","Kendall County","Knox County","Lake County","LaSalle County","Lawrence County","Lee County","Livingston County","Logan County","McDonough County","McHenry County","McLean County","Macon County","Macoupin County","Madison County","Marion County","Marshall County","Mason County","Massac County","Menard County","Mercer County","Monroe County","Montgomery County","Morgan County","Moultrie County","Ogle County","Peoria County","Perry County","Piatt County","Pike County","Pope County","Pulaski County","Putnam County","Randolph County","Richland County","Rock Island"," County","St. Clair County","Saline County","Sangamon County","Schuyler County","Scott County","Shelby County","Stark County","Stephenson County","Tazewell County","Union County","Vermilion County","Wabash County","Warren County","Washington County","Wayne County","White County","Whiteside County","Will County","Williamson County","Winnebago County","Woodford County","Adams County","Allen County","Bartholomew County","Benton County","Blackford County","Boone County","Brown County","Carroll County","Cass County","Clark County","Clay County","Clinton County","Crawford County","Daviess County","Dearborn County","Decatur County","DeKalb County","Delaware County","Dubois County","Elkhart County","Fayette County","Floyd County","Fountain County","Franklin County","Fulton County","Gibson County","Grant County","Greene County","Hamilton County","Hancock County","Harrison County","Hendricks County","Henry County","Howard County","Huntington County","Jackson County","Jasper County","Jay County","Jefferson County","Jennings County","Johnson County","Knox County","Kosciusko County","LaGrange County","Lake County","LaPorte County","Lawrence County","Madison County","Marion County","Marshall County","Martin County","Miami County","Monroe County","Montgomery County","Morgan County","Newton County","Noble County","Ohio County","Orange County","Owen County","Parke County","Perry County","Pike County","Porter County","Posey County","Pulaski County","Putnam County","Randolph County","Ripley County","Rush County","St. Joseph County","Scott County","Shelby County","Spencer County","Starke County","Steuben County","Sullivan County","Switzerland County","Tippecanoe County","Tipton County","Union County","Vanderburgh County","Vermillion County","Vigo County","Wabash County","Warren County","Warrick County","Washington County","Wayne County","Wells County","White County","Whitley County","Adair County","Adams County","Allamakee County","Appanoose County","Audubon County","Benton County","Black Hawk County","Boone County","Bremer County","Buchanan County","Buena Vista County","Butler County","Calhoun County","Carroll County","Cass County","Cedar County","Cerro Gordo County","Cherokee County","Chickasaw County","Clarke County","Clay County","Clayton County","Clinton County","Crawford County","Dallas County","Davis County","Decatur County","Delaware County","Des Moines County","Dickinson County","Dubuque County","Emmet County","Fayette County","Floyd County","Franklin County","Fremont County","Greene County","Grundy County","Guthrie County","Hamilton County","Hancock County","Hardin County","Harrison County","Henry County","Howard County","Humboldt County","Ida County","Iowa County","Jackson County","Jasper County","Jefferson County","Johnson County","Jones County","Keokuk County","Kossuth County","Lee County","Linn County","Louisa County","Lucas County","Lyon County","Madison County","Mahaska County","Marion County","Marshall County","Mills County","Mitchell County","Monona County","Monroe County","Montgomery County","Muscatine County","O'Brien County","Osceola County","Page County","Palo Alto County","Plymouth County","Pocahontas County","Polk County","Pottawattamie County","Poweshiek County","Ringgold County","Sac County","Scott County","Shelby County","Sioux County","Story County","Tama County","Taylor County","Union County","Van Buren County","Wapello County","Warren County","Washington County","Wayne County","Webster County","Winnebago County","Winneshiek County","Woodbury County","Worth County","Wright County","Allen County","Anderson County","Atchison County","Barber County","Barton County","Bourbon County","Brown County","Butler County","Chase County","Chautauqua County","Cherokee County","Cheyenne County","Clark County","Clay County","Cloud County","Coffey County","Comanche County","Cowley County","Crawford County","Decatur County","Dickinson County","Doniphan County","Douglas County","Edwards County","Elk County","Ellis County","Ellsworth County","Finney County","Ford County","Franklin County","Geary County","Gove County","Graham County","Grant County","Gray County","Greeley County","Greenwood County","Hamilton County","Harper County","Harvey County","Haskell County","Hodgeman County","Jackson County","Jefferson County","Jewell County","Johnson County","Kearny County","Kingman County","Kiowa County","Labette County","Lane County","Leavenworth County","Lincoln County","Linn County","Logan County","Lyon County","McPherson County","Marion County","Marshall County","Meade County","Miami County","Mitchell County","Montgomery County","Morris County","Morton County","Nemaha County","Neosho County","Ness County","Norton County","Osage County","Osborne County","Ottawa County","Pawnee County","Phillips County","Pottawatomie County","Pratt County","Rawlins County","Reno County","Republic County","Rice County","Riley County","Rooks County","Rush County","Russell County","Saline County","Scott County","Sedgwick County","Seward County","Shawnee County","Sheridan County","Sherman County","Smith County","Stafford County","Stanton County","Stevens County","Sumner County","Thomas County","Trego County","Wabaunsee County","Wallace County","Washington County","Wichita County","Wilson County","Woodson County","Wyandotte County","Adair County","Allen County","Anderson County","Ballard County","Barren County","Bath County","Bell County","Boone County","Bourbon County","Boyd County","Boyle County","Bracken County","Breathitt County","Breckinridge County","Bullitt County","Butler County","Caldwell County","Calloway County","Campbell County","Carlisle County","Carroll County","Carter County","Casey County","Christian County","Clark County","Clay County","Clinton County","Crittenden County","Cumberland County","Daviess County","Edmonson County","Elliott County","Estill County","Fayette County","Fleming County","Floyd County","Franklin County","Fulton County","Gallatin County","Garrard County","Grant County","Graves County","Grayson County","Green County","Greenup County","Hancock County","Hardin County","Harlan County","Harrison County","Hart County","Henderson County","Henry County","Hickman County","Hopkins County","Jackson County","Jefferson County","Jessamine County","Johnson County","Kenton County","Knott County","Knox County","LaRue County","Laurel County","Lawrence County","Lee County","Leslie County","Letcher County","Lewis County","Lincoln County","Livingston County","Logan County","Lyon County","McCracken County","McCreary County","McLean County","Madison County","Magoffin County","Marion County","Marshall County","Martin County","Mason County","Meade County","Menifee County","Mercer County","Metcalfe County","Monroe County","Montgomery County","Morgan County","Muhlenberg County","Nelson County","Nicholas County","Ohio County","Oldham County","Owen County","Owsley County","Pendleton County","Perry County","Pike County","Powell County","Pulaski County","Robertson County","Rockcastle County","Rowan County","Russell County","Scott County","Shelby County","Simpson County","Spencer County","Taylor County","Todd County","Trigg County","Trimble County","Union County","Warren County","Washington County","Wayne County","Webster County","Whitley County","Wolfe County","Woodford County","Acadia Parish","Allen Parish","Ascension Parish","Assumption Parish","Avoyelles Parish","Beauregard Parish","Bienville Parish","Bossier Parish","Caddo Parish","Calcasieu Parish","Caldwell Parish","Cameron Parish","Catahoula Parish","Claiborne Parish","Concordia Parish","De Soto Parish","East Baton Rouge Parish","East Carroll Parish","East Feliciana Parish","Evangeline Parish","Franklin Parish","Grant Parish","Iberia Parish","Iberville Parish","Jackson Parish","Jefferson Parish","Jefferson Davis Parish","Lafayette Parish","Lafourche Parish","LaSalle Parish","Lincoln Parish","Livingston Parish","Madison Parish","Morehouse Parish","Natchitoches Parish","Orleans Parish","Ouachita Parish","Plaquemines Parish","Pointe Coupee Parish","Rapides Parish","Red River Parish","Richland Parish","Sabine Parish","St. Bernard Parish","St. Charles Parish","St. Helena Parish","St. James Parish","St. John the Baptist Parish","St. Landry Parish","St. Martin Parish","St. Mary Parish","St. Tammany Parish","Tangipahoa Parish","Tensas Parish","Terrebonne Parish","Union Parish","Vermilion Parish","Vernon Parish","Washington Parish","Webster Parish","West Baton Rouge Parish","West Carroll Parish","West Feliciana Parish","Winn Parish","Androscoggin County","Aroostook County","Cumberland County","Franklin County","Hancock County","Kennebec County","Knox County","Lincoln County","Oxford County","Penobscot County","Piscataquis County","Sagadahoc County","Somerset County","Waldo County","Washington County","York County","Allegany County","Anne Arundel County","Baltimore County","Calvert County","Caroline County","Carroll County","Cecil County","Charles County","Dorchester County","Frederick County","Garrett County","Harford County","Howard County","Kent County","Montgomery County","Prince George's County","Queen Anne's County","St. Mary's County","Somerset County","Talbot County","Washington County","Wicomico County","Worcester County","Baltimore City","Barnstable County","Berkshire County","Bristol County","Dukes County","Essex County","Franklin County","Hampden County","Hampshire County","Middlesex County","Nantucket, Town and County","Norfolk County","Plymouth County","Suffolk County","Worcester County","Alcona County","Alger County","Allegan County","Alpena County","Antrim County","Arenac County","Baraga County","Barry County","Bay County","Benzie County","Berrien County","Branch County","Calhoun County","Cass County","Charlevoix County","Cheboygan County","Chippewa County","Clare County","Clinton County","Crawford County","Delta County","Dickinson County","Eaton County","Emmet County","Genesee County","Gladwin County","Gogebic County","Grand Traverse County","Gratiot County","Hillsdale County","Houghton County","Huron County","Ingham County","Ionia County","Iosco County","Iron County","Isabella County","Jackson County","Kalamazoo County","Kalkaska County","Kent County","Keweenaw County","Lake County","Lapeer County","Leelanau County","Lenawee County","Livingston County","Luce County","Mackinac County","Macomb County","Manistee County","Marquette County","Mason County","Mecosta County","Menominee County","Midland County","Missaukee County","Monroe County","Montcalm County","Montmorency County","Muskegon County","Newaygo County","Oakland County","Oceana County","Ogemaw County","Ontonagon County","Osceola County","Oscoda County","Otsego County","Ottawa County","Presque Isle County","Roscommon County","Saginaw County","St. Clair County","St. Joseph County","Sanilac County","Schoolcraft County","Shiawassee County","Tuscola County","Van Buren County","Washtenaw County","Wayne County","Wexford County","Aitkin County","Anoka County","Becker County","Beltrami County","Benton County","Big Stone County","Blue Earth County","Brown County","Carlton County","Carver County","Cass County","Chippewa County","Chisago County","Clay County","Clearwater County","Cook County","Cottonwood County","Crow Wing County","Dakota County","Dodge County","Douglas County","Faribault County","Fillmore County","Freeborn County","Goodhue County","Grant County","Hennepin County","Houston County","Hubbard County","Isanti County","Itasca County","Jackson County","Kanabec County","Kandiyohi County","Kittson County","Koochiching County","Lac qui Parle County","Lake County","Lake of the Woods County","Le Sueur County","Lincoln County","Lyon County","McLeod County","Mahnomen County","Marshall County","Martin County","Meeker County","Mille Lacs County","Morrison County","Mower County","Murray County","Nicollet County","Nobles County","Norman County","Olmsted County","Otter Tail County","Pennington County","Pine County","Pipestone County","Polk County","Pope County","Ramsey County","Red Lake County","Redwood County","Renville County","Rice County","Rock County","Roseau County","St. Louis County","Scott County","Sherburne County","Sibley County","Stearns County","Steele County","Stevens County","Swift County","Todd County","Traverse County","Wabasha County","Wadena County","Waseca County","Washington County","Watonwan County","Wilkin County","Winona County","Wright County","Yellow Medicine County","Adams County","Alcorn County","Amite County","Attala County","Benton County","Bolivar County","Calhoun County","Carroll County","Chickasaw County","Choctaw County","Claiborne County","Clarke County","Clay County","Coahoma County","Copiah County","Covington County","DeSoto County","Forrest County","Franklin County","George County","Greene County","Grenada County","Hancock County","Harrison County","Hinds County","Holmes County","Humphreys County","Issaquena County","Itawamba County","Jackson County","Jasper County","Jefferson County","Jefferson Davis County","Jones County","Kemper County","Lafayette County","Lamar County","Lauderdale County","Lawrence County","Leake County","Lee County","Leflore County","Lincoln County","Lowndes County","Madison County","Marion County","Marshall County","Monroe County","Montgomery County","Neshoba County","Newton County","Noxubee County","Oktibbeha County","Panola County","Pearl River County","Perry County","Pike County","Pontotoc County","Prentiss County","Quitman County","Rankin County","Scott County","Sharkey County","Simpson County","Smith County","Stone County","Sunflower County","Tallahatchie County","Tate County","Tippah County","Tishomingo County","Tunica County","Union County","Walthall County","Warren County","Washington County","Wayne County","Webster County","Wilkinson County","Winston County","Yalobusha County","Yazoo County","Adair County","Andrew County","Atchison County","Audrain County","Barry County","Barton County","Bates County","Benton County","Bollinger County","Boone County","Buchanan County","Butler County","Caldwell County","Callaway County","Camden County","Cape Girardeau County","Carroll County","Carter County","Cass County","Cedar County","Chariton County","Christian County","Clark County","Clay County","Clinton County","Cole County","Cooper County","Crawford County","Dade County","Dallas County","Daviess County","DeKalb County","Dent County","Douglas County","Dunklin County","Franklin County","Gasconade County","Gentry County","Greene County","Grundy County","Harrison County","Henry County","Hickory County","Holt County","Howard County","Howell County","Iron County","Jackson County","Jasper County","Jefferson County","Johnson County","Knox County","Laclede County","Lafayette County","Lawrence County","Lewis County","Lincoln County","Linn County","Livingston County","McDonald County","Macon County","Madison County","Maries County","Marion County","Mercer County","Miller County","Mississippi County","Moniteau County","Monroe County","Montgomery County","Morgan County","New Madrid County","Newton County","Nodaway County","Oregon County","Osage County","Ozark County","Pemiscot County","Perry County","Pettis County","Phelps County","Pike County","Platte County","Polk County","Pulaski County","Putnam County","Ralls County","Randolph County","Ray County","Reynolds County","Ripley County","St. Charles County","St. Clair County","Ste. Genevieve County","St. Francois County","St. Louis County","Saline County","Schuyler County","Scotland County","Scott County","Shannon County","Shelby County","Stoddard County","Stone County","Sullivan County","Taney County","Texas County","Vernon County","Warren County","Washington County","Wayne County","Webster County","Worth County","Wright County","St. Louis","City of Beaverhead County","Big Horn County","Blaine County","Broadwater County","Carbon County","Carter County","Cascade County","Chouteau County","Custer County","Daniels County","Dawson County","Deer Lodge County","Fallon County","Fergus County","Flathead County","Gallatin County","Garfield County","Glacier County","Golden Valley County","Granite County","Hill County","Jefferson County","Judith Basin County","Lake County","Lewis and Clark County","Liberty County","Lincoln County","McCone County","Madison County","Meagher County","Mineral County","Missoula County","Musselshell County","Park County","Petroleum County","Phillips County","Pondera County","Powder River County","Powell County","Prairie County","Ravalli County","Richland County","Roosevelt County","Rosebud County","Sanders County","Sheridan County","Silver Bow County","Stillwater County","Sweet Grass County","Teton County","Toole County","Treasure County","Valley County","Wheatland County","Wibaux County","Yellowstone County","Adams County","Antelope County","Arthur County","Banner County","Blaine County","Boone County","Box Butte County","Boyd County","Brown County","Buffalo County","Burt County","Butler County","Cass County","Cedar County","Chase County","Cherry County","Cheyenne County","Clay County","Colfax County","Cuming County","Custer County","Dakota County","Dawes County","Dawson County","Deuel County","Dixon County","Dodge County","Douglas County","Dundy County","Fillmore County","Franklin County","Frontier County","Furnas County","Gage County","Garden County","Garfield County","Gosper County","Grant County","Greeley County","Hall County","Hamilton County","Harlan County","Hayes County","Hitchcock County","Holt County","Hooker County","Howard County","Jefferson County","Johnson County","Kearney County","Keith County","Keya Paha County","Kimball County","Knox County","Lancaster County","Lincoln County","Logan County","Loup County","McPherson County","Madison County","Merrick County","Morrill County","Nance County","Nemaha County","Nuckolls County","Otoe County","Pawnee County","Perkins County","Phelps County","Pierce County","Platte County","Polk County","Red Willow County","Richardson County","Rock County","Saline County","Sarpy County","Saunders County","Scotts Bluff County","Seward County","Sheridan County","Sherman County","Sioux County","Stanton County","Thayer County","Thomas County","Thurston County","Valley County","Washington County","Wayne County","Webster County","Wheeler County","York County","Churchill County","Clark County","Douglas County","Elko County","Esmeralda County","Eureka County","Humboldt County","Lander County","Lincoln County","Lyon County","Mineral County","Nye County","Pershing County","Storey County","Washoe County","White Pine County","Carson City, Consolidated Municipality"," of Belknap County","Carroll County","Cheshire County","Coos County","Grafton County","Hillsborough County","Merrimack County","Rockingham County","Strafford County","Sullivan County","Atlantic County","Bergen County","Burlington County","Camden County","Cape May County","Cumberland County","Essex County","Gloucester County","Hudson County","Hunterdon County","Mercer County","Middlesex County","Monmouth County","Morris County","Ocean County","Passaic County","Salem County","Somerset County","Sussex County","Union County","Warren County","Bernalillo County","Catron County","Chaves County","Cibola County","Colfax County","Curry County","De Baca County","Do\xF1a Ana County","Eddy County","Grant County","Guadalupe County","Harding County","Hidalgo County","Lea County","Lincoln County","Los Alamos County","Luna County","McKinley County","Mora County","Otero County","Quay County","Rio Arriba County","Roosevelt County","Sandoval County","San Juan County","San Miguel County","Santa Fe County","Sierra County","Socorro County","Taos County","Torrance County","Union County","Valencia County","Albany County","Allegany County","Bronx County","Broome County","Cattaraugus County","Cayuga County","Chautauqua County","Chemung County","Chenango County","Clinton County","Columbia County","Cortland County","Delaware County","Dutchess County","Erie County","Essex County","Franklin County","Fulton County","Genesee County","Greene County","Hamilton County","Herkimer County","Jefferson County","Kings County","Lewis County","Livingston County","Madison County","Monroe County","Montgomery County","Nassau County","New York County","Niagara County","Oneida County","Onondaga County","Ontario County","Orange County","Orleans County","Oswego County","Otsego County","Putnam County","Queens County","Rensselaer County","Richmond County","Rockland County","St. Lawrence County","Saratoga County","Schenectady County","Schoharie County","Schuyler County","Seneca County","Steuben County","Suffolk County","Sullivan County","Tioga County","Tompkins County","Ulster County","Warren County","Washington County","Wayne County","Westchester County","Wyoming County","Yates County","Alamance County","Alexander County","Alleghany County","Anson County","Ashe County","Avery County","Beaufort County","Bertie County","Bladen County","Brunswick County","Buncombe County","Burke County","Cabarrus County","Caldwell County","Camden County","Carteret County","Caswell County","Catawba County","Chatham County","Cherokee County","Chowan County","Clay County","Cleveland County","Columbus County","Craven County","Cumberland County","Currituck County","Dare County","Davidson County","Davie County","Duplin County","Durham County","Edgecombe County","Forsyth County","Franklin County","Gaston County","Gates County","Graham County","Granville County","Greene County","Guilford County","Halifax County","Harnett County","Haywood County","Henderson County","Hertford County","Hoke County","Hyde County","Iredell County","Jackson County","Johnston County","Jones County","Lee County","Lenoir County","Lincoln County","McDowell County","Macon County","Madison County","Martin County","Mecklenburg County","Mitchell County","Montgomery County","Moore County","Nash County","New Hanover County","Northampton County","Onslow County","Orange County","Pamlico County","Pasquotank County","Pender County","Perquimans County","Person County","Pitt County","Polk County","Randolph County","Richmond County","Robeson County","Rockingham County","Rowan County","Rutherford County","Sampson County","Scotland County","Stanly County","Stokes County","Surry County","Swain County","Transylvania County","Tyrrell County","Union County","Vance County","Wake County","Warren County","Washington County","Watauga County","Wayne County","Wilkes County","Wilson County","Yadkin County","Yancey County","Adams County","Barnes County","Benson County","Billings County","Bottineau County","Bowman County","Burke County","Burleigh County","Cass County","Cavalier County","Dickey County","Divide County","Dunn County","Eddy County","Emmons County","Foster County","Golden Valley County","Grand Forks County","Grant County","Griggs County","Hettinger County","Kidder County","LaMoure County","Logan County","McHenry County","McIntosh County","McKenzie County","McLean County","Mercer County","Morton County","Mountrail County","Nelson County","Oliver County","Pembina County","Pierce County","Ramsey County","Ransom County","Renville County","Richland County","Rolette County","Sargent County","Sheridan County","Sioux County","Slope County","Stark County","Steele County","Stutsman County","Towner County","Traill County","Walsh County","Ward County","Wells County","Williams County","Northern Island","Rota Municipality","","Saipan Municipality","","Tinian Municipality","","Adams County","Allen County","Ashland County","Ashtabula County","Athens County","Auglaize County","Belmont County","Brown County","Butler County","Carroll County","Champaign County","Clark County","Clermont County","Clinton County","Columbiana County","Coshocton County","Crawford County","Cuyahoga County","Darke County","Defiance County","Delaware County","Erie County","Fairfield County","Fayette County","Franklin County","Fulton County","Gallia County","Geauga County","Greene County","Guernsey County","Hamilton County","Hancock County","Hardin County","Harrison County","Henry County","Highland County","Hocking County","Holmes County","Huron County","Jackson County","Jefferson County","Knox County","Lake County","Lawrence County","Licking County","Logan County","Lorain County","Lucas County","Madison County","Mahoning County","Marion County","Medina County","Meigs County","Mercer County","Miami County","Monroe County","Montgomery County","Morgan County","Morrow County","Muskingum County","Noble County","Ottawa County","Paulding County","Perry County","Pickaway County","Pike County","Portage County","Preble County","Putnam County","Richland County","Ross County","Sandusky County","Scioto County","Seneca County","Shelby County","Stark County","Summit County","Trumbull County","Tuscarawas County","Union County","Van Wert County","Vinton County","Warren County","Washington County","Wayne County","Williams County","Wood County","Wyandot County","Adair County","Alfalfa County","Atoka County","Beaver County","Beckham County","Blaine County","Bryan County","Caddo County","Canadian County","Carter County","Cherokee County","Choctaw County","Cimarron County","Cleveland County","Coal County","Comanche County","Cotton County","Craig County","Creek County","Custer County","Delaware County","Dewey County","Ellis County","Garfield County","Garvin County","Grady County","Grant County","Greer County","Harmon County","Harper County","Haskell County","Hughes County","Jackson County","Jefferson County","Johnston County","Kay County","Kingfisher County","Kiowa County","Latimer County","Le Flore County","Lincoln County","Logan County","Love County","McClain County","McCurtain County","McIntosh County","Major County","Marshall County","Mayes County","Murray County","Muskogee County","Noble County","Nowata County","Okfuskee County","Oklahoma County","Okmulgee County","Osage County","Ottawa County","Pawnee County","Payne County","Pittsburg County","Pontotoc County","Pottawatomie County","Pushmataha County","Roger Mills County","Rogers County","Seminole County","Sequoyah County","Stephens County","Texas County","Tillman County","Tulsa County","Wagoner County","Washington County","Washita County","Woods County","Woodward County","Baker County","Benton County","Clackamas County","Clatsop County","Columbia County","Coos County","Crook County","Curry County","Deschutes County","Douglas County","Gilliam County","Grant County","Harney County","Hood River County","Jackson County","Jefferson County","Josephine County","Klamath County","Lake County","Lane County","Lincoln County","Linn County","Malheur County","Marion County","Morrow County","Multnomah County","Polk County","Sherman County","Tillamook County","Umatilla County","Union County","Wallowa County","Wasco County","Washington County","Wheeler County","Yamhill County","Adams County","Allegheny County","Armstrong County","Beaver County","Bedford County","Berks County","Blair County","Bradford County","Bucks County","Butler County","Cambria County","Cameron County","Carbon County","Centre County","Chester County","Clarion County","Clearfield County","Clinton County","Columbia County","Crawford County","Cumberland County","Dauphin County","Delaware County","Elk County","Erie County","Fayette County","Forest County","Franklin County","Fulton County","Greene County","Huntingdon County","Indiana County","Jefferson County","Juniata County","Lackawanna County","Lancaster County","Lawrence County","Lebanon County","Lehigh County","Luzerne County","Lycoming County","McKean County","Mercer County","Mifflin County","Monroe County","Montgomery County","Montour County","Northampton County","Northumberland County","Perry County","Philadelphia County","Pike County","Potter County","Schuylkill County","Snyder County","Somerset County","Sullivan County","Susquehanna County","Tioga County","Union County","Venango County","Warren County","Washington County","Wayne County","Westmoreland County","Wyoming County","York County","Adjuntas Municipality","Aguada Municipality","Aguadilla Municipality","Aguas Buenas Municipality","Aibonito Municipality","A\xF1asco Municipality","Arecibo Municipality","Arroyo Municipality","Barceloneta Municipality","Barranquitas Municipality","Bayam\xF3n Municipality","Cabo Rojo Municipality","Caguas Municipality","Camuy Municipality","Can\xF3vanas Municipality","Carolina Municipality","Cata\xF1o Municipality","Cayey Municipality","Ceiba Municipality","Ciales Municipality","Cidra Municipality","Coamo Municipality","Comer\xEDo Municipality","Corozal Municipality","Culebra Municipality","Dorado Municipality","Fajardo Municipality","Florida Municipality","Gu\xE1nica Municipality","Guayama Municipality","Guayanilla Municipality","Guaynabo Municipality","Gurabo Municipality","Hatillo Municipality","Hormigueros Municipality","Humacao Municipality","Isabela Municipality","Jayuya Municipality","Juana D\xEDaz Municipality","Juncos Municipality","Lajas Municipality","Lares Municipality","Las Mar\xEDas Municipality","Las Piedras Municipality","Lo\xEDza Municipality","Luquillo Municipality","Manat\xED Municipality","Maricao Municipality","Maunabo Municipality","Mayag\xFCez Municipality","Moca Municipality","Morovis Municipality","Naguabo Municipality","Naranjito Municipality","Orocovis Municipality","Patillas Municipality","Pe\xF1uelas Municipality","Ponce Municipality","Quebradillas Municipality","Rinc\xF3n Municipality","R\xEDo Grande Municipality","Sabana Grande Municipality","Salinas Municipality","San Germ\xE1n Municipality","San Juan Municipality","San Lorenzo Municipality","San Sebasti\xE1n Municipality","Santa Isabel Municipality","Toa Alta Municipality","Toa Baja Municipality","Trujillo Alto Municipality","Utuado Municipality","Vega Alta Municipality","Vega Baja Municipality","Vieques Municipality","Villalba Municipality","Yabucoa Municipality","Yauco Municipality","Bristol County","Kent County","Newport County","Providence County","Washington County","Abbeville County","Aiken County","Allendale County","Anderson County","Bamberg County","Barnwell County","Beaufort County","Berkeley County","Calhoun County","Charleston County","Cherokee County","Chester County","Chesterfield County","Clarendon County","Colleton County","Darlington County","Dillon County","Dorchester County","Edgefield County","Fairfield County","Florence County","Georgetown County","Greenville County","Greenwood County","Hampton County","Horry County","Jasper County","Kershaw County","Lancaster County","Laurens County","Lee County","Lexington County","McCormick County","Marion County","Marlboro County","Newberry County","Oconee County","Orangeburg County","Pickens County","Richland County","Saluda County","Spartanburg County","Sumter County","Union County","Williamsburg County","York County","Aurora County","Beadle County","Bennett County","Bon Homme County","Brookings County","Brown County","Brule County","Buffalo County","Butte County","Campbell County","Charles Mix County","Clark County","Clay County","Codington County","Corson County","Custer County","Davison County","Day County","Deuel County","Dewey County","Douglas County","Edmunds County","Fall River County","Faulk County","Grant County","Gregory County","Haakon County","Hamlin County","Hand County","Hanson County","Harding County","Hughes County","Hutchinson County","Hyde County","Jackson County","Jerauld County","Jones County","Kingsbury County","Lake County","Lawrence County","Lincoln County","Lyman County","McCook County","McPherson County","Marshall County","Meade County","Mellette County","Miner County","Minnehaha County","Moody County","Oglala Lakota County","Pennington County","Perkins County","Potter County","Roberts County","Sanborn County","Spink County","Stanley County","Sully County","Todd County","Tripp County","Turner County","Union County","Walworth County","Yankton County","Ziebach County","Anderson County","Bedford County","Benton County","Bledsoe County","Blount County","Bradley County","Campbell County","Cannon County","Carroll County","Carter County","Cheatham County","Chester County","Claiborne County","Clay County","Cocke County","Coffee County","Crockett County","Cumberland County","Davidson County","Decatur County","DeKalb County","Dickson County","Dyer County","Fayette County","Fentress County","Franklin County","Gibson County","Giles County","Grainger County","Greene County","Grundy County","Hamblen County","Hamilton County","Hancock County","Hardeman County","Hardin County","Hawkins County","Haywood County","Henderson County","Henry County","Hickman County","Houston County","Humphreys County","Jackson County","Jefferson County","Johnson County","Knox County","Lake County","Lauderdale County","Lawrence County","Lewis County","Lincoln County","Loudon County","McMinn County","McNairy County","Macon County","Madison County","Marion County","Marshall County","Maury County","Meigs County","Monroe County","Montgomery County","Moore County","Morgan County","Obion County","Overton County","Perry County","Pickett County","Polk County","Putnam County","Rhea County","Roane County","Robertson County","Rutherford County","Scott County","Sequatchie County","Sevier County","Shelby County","Smith County","Stewart County","Sullivan County","Sumner County","Tipton County","Trousdale County","Unicoi County","Union County","Van Buren County","Warren County","Washington County","Wayne County","Weakley County","White County","Williamson County","Wilson County","Anderson County","Andrews County","Angelina County","Aransas County","Archer County","Armstrong County","Atascosa County","Austin County","Bailey County","Bandera County","Bastrop County","Baylor County","Bee County","Bell County","Bexar County","Blanco County","Borden County","Bosque County","Bowie County","Brazoria County","Brazos County","Brewster County","Briscoe County","Brooks County","Brown County","Burleson County","Burnet County","Caldwell County","Calhoun County","Callahan County","Cameron County","Camp County","Carson County","Cass County","Castro County","Chambers County","Cherokee County","Childress County","Clay County","Cochran County","Coke County","Coleman County","Collin County","Collingsworth County","Colorado County","Comal County","Comanche County","Concho County","Cooke County","Coryell County","Cottle County","Crane County","Crockett County","Crosby County","Culberson County","Dallam County","Dallas County","Dawson County","Deaf Smith County","Delta County","Denton County","DeWitt County","Dickens County","Dimmit County","Donley County","Duval County","Eastland County","Ector County","Edwards County","Ellis County","El Paso County","Erath County","Falls County","Fannin County","Fayette County","Fisher County","Floyd County","Foard County","Fort Bend County","Franklin County","Freestone County","Frio County","Gaines County","Galveston County","Garza County","Gillespie County","Glasscock County","Goliad County","Gonzales County","Gray County","Grayson County","Gregg County","Grimes County","Guadalupe County","Hale County","Hall County","Hamilton County","Hansford County","Hardeman County","Hardin County","Harris County","Harrison County","Hartley County","Haskell County","Hays County","Hemphill County","Henderson County","Hidalgo County","Hill County","Hockley County","Hood County","Hopkins County","Houston County","Howard County","Hudspeth County","Hunt County","Hutchinson County","Irion County","Jack County","Jackson County","Jasper County","Jeff Davis County","Jefferson County","Jim Hogg County","Jim Wells County","Johnson County","Jones County","Karnes County","Kaufman County","Kendall County","Kenedy County","Kent County","Kerr County","Kimble County","King County","Kinney County","Kleberg County","Knox County","Lamar County","Lamb County","Lampasas County","La Salle County","Lavaca County","Lee County","Leon County","Liberty County","Limestone County","Lipscomb County","Live Oak County","Llano County","Loving County","Lubbock County","Lynn County","McCulloch County","McLennan County","McMullen County","Madison County","Marion County","Martin County","Mason County","Matagorda County","Maverick County","Medina County","Menard County","Midland County","Milam County","Mills County","Mitchell County","Montague County","Montgomery County","Moore County","Morris County","Motley County","Nacogdoches County","Navarro County","Newton County","Nolan County","Nueces County","Ochiltree County","Oldham County","Orange County","Palo Pinto County","Panola County","Parker County","Parmer County","Pecos County","Polk County","Potter County","Presidio County","Rains County","Randall County","Reagan County","Real County","Red River County","Reeves County","Refugio County","Roberts County","Robertson County","Rockwall County","Runnels County","Rusk County","Sabine County","San Augustine County","San Jacinto County","San Patricio County","San Saba County","Schleicher County","Scurry County","Shackelford County","Shelby County","Sherman County","Smith County","Somervell County","Starr County","Stephens County","Sterling County","Stonewall County","Sutton County","Swisher County","Tarrant County","Taylor County","Terrell County","Terry County","Throckmorton County","Titus County","Tom Green County","Travis County","Trinity County","Tyler County","Upshur County","Upton County","Uvalde County","Val Verde County","Van Zandt County","Victoria County","Walker County","Waller County","Ward County","Washington County","Webb County","Wharton County","Wheeler County","Wichita County","Wilbarger County","Willacy County","Williamson County","Wilson County","Winkler County","Wise County","Wood County","Yoakum County","Young County","Zapata County","Zavala County","Baker Island","Howland Island","Jarvis Island","Johnston AtollKingman ReefMidway Island","sNavassa Island","Palmyra AtollWake Island","Beaver County","Box Elder County","Cache County","Carbon County","Daggett County","Davis County","Duchesne County","Emery County","Garfield County","Grand County","Iron County","Juab County","Kane County","Millard County","Morgan County","Piute County","Rich County","Salt Lake County","San Juan County","Sanpete County","Sevier County","Summit County","Tooele County","Uintah County","Utah County","Wasatch County","Washington County","Wayne County","Weber County","Addison County","Bennington County","Caledonia County","Chittenden County","Essex County","Franklin County","Grand Isle County","Lamoille County","Orange County","Orleans County","Rutland County","Washington County","Windham County","Windsor County","Saint Croix Island","Saint John Island","Saint Thomas Island","Accomack County","Albemarle County","Alleghany County","Amelia County","Amherst County","Appomattox County","Arlington County","Augusta County","Bath County","Bedford County","Bland County","Botetourt County","Brunswick County","Buchanan County","Buckingham County","Campbell County","Caroline County","Carroll County","Charles City County","Charlotte County","Chesterfield County","Clarke County","Craig County","Culpeper County","Cumberland County","Dickenson County","Dinwiddie County","Essex County","Fairfax County","Fauquier County","Floyd County","Fluvanna County","Franklin County","Frederick County","Giles County","Gloucester County","Goochland County","Grayson County","Greene County","Greensville County","Halifax County","Hanover County","Henrico County","Henry County","Highland County","Isle of Wight County","James City County","King and Queen County","King George County","King William County","Lancaster County","Lee County","Loudoun County","Louisa County","Lunenburg County","Madison County","Mathews County","Mecklenburg County","Middlesex County","Montgomery County","Nelson County","New Kent County","Northampton County","Northumberland County","Nottoway County","Orange County","Page County","Patrick County","Pittsylvania County","Powhatan County","Prince Edward County","Prince George County","Prince William County","Pulaski County","Rappahannock County","Richmond County","Roanoke County","Rockbridge County","Rockingham County","Russell County","Scott County","Shenandoah County","Smyth County","Southampton County","Spotsylvania County","Stafford County","Surry County","Sussex County","Tazewell County","Warren County","Washington County","Westmoreland County","Wise County","Wythe County","York County","Alexandria","City of Bristol","City of Buena Vista","City of Charlottesville","City of Chesapeake","City of Colonial Heights","City of Covington","City of Danville","City of Emporia","City of Fairfax","City of Falls Church","City of Franklin","City of Fredericksburg","City of Galax","City of Hampton","City of Harrisonburg","City of Hopewell","City of Lexington","City of Lynchburg","City of Manassas","City of Manassas Park","City of Martinsville","City of Newport News","City of Norfolk","City of Norton","City of Petersburg","City of Poquoson","City of Portsmouth","City of Radford","City of Richmond","City of Roanoke","City of Salem","City of Staunton","City of Suffolk","City of Virginia Beach","City of Waynesboro","City of Williamsburg","City of Winchester","City of Adams County","Asotin County","Benton County","Chelan County","Clallam County","Clark County","Columbia County","Cowlitz County","Douglas County","Ferry County","Franklin County","Garfield County","Grant County","Grays Harbor County","Island"," County","Jefferson County","King County","Kitsap County","Kittitas County","Klickitat County","Lewis County","Lincoln County","Mason County","Okanogan County","Pacific County","Pend Oreille County","Pierce County","San Juan County","Skagit County","Skamania County","Snohomish County","Spokane County","Stevens County","Thurston County","Wahkiakum County","Walla Walla County","Whatcom County","Whitman County","Yakima County","Barbour County","Berkeley County","Boone County","Braxton County","Brooke County","Cabell County","Calhoun County","Clay County","Doddridge County","Fayette County","Gilmer County","Grant County","Greenbrier County","Hampshire County","Hancock County","Hardy County","Harrison County","Jackson County","Jefferson County","Kanawha County","Lewis County","Lincoln County","Logan County","McDowell County","Marion County","Marshall County","Mason County","Mercer County","Mineral County","Mingo County","Monongalia County","Monroe County","Morgan County","Nicholas County","Ohio County","Pendleton County","Pleasants County","Pocahontas County","Preston County","Putnam County","Raleigh County","Randolph County","Ritchie County","Roane County","Summers County","Taylor County","Tucker County","Tyler County","Upshur County","Wayne County","Webster County","Wetzel County","Wirt County","Wood County","Wyoming County","Adams County","Ashland County","Barron County","Bayfield County","Brown County","Buffalo County","Burnett County","Calumet County","Chippewa County","Clark County","Columbia County","Crawford County","Dane County","Dodge County","Door County","Douglas County","Dunn County","Eau Claire County","Florence County","Fond du Lac County","Forest County","Grant County","Green County","Green Lake County","Iowa County","Iron County","Jackson County","Jefferson County","Juneau County","Kenosha County","Kewaunee County","La Crosse County","Lafayette County","Langlade County","Lincoln County","Manitowoc County","Marathon County","Marinette County","Marquette County","Menominee County","Milwaukee County","Monroe County","Oconto County","Oneida County","Outagamie County","Ozaukee County","Pepin County","Pierce County","Polk County","Portage County","Price County","Racine County","Richland County","Rock County","Rusk County","St. Croix County","Sauk County","Sawyer County","Shawano County","Sheboygan County","Taylor County","Trempealeau County","Vernon County","Vilas County","Walworth County","Washburn County","Washington County","Waukesha County","Waupaca County","Waushara County","Winnebago County","Wood County","Albany County","Big Horn County","Campbell County","Carbon County","Converse County","Crook County","Fremont County","Goshen County","Hot Springs County","Johnson County","Laramie County","Lincoln County","Natrona County","Niobrara County","Park County","Platte County","Sheridan County","Sublette County","Sweetwater County","Teton County","Uinta County","Washakie County","Weston County"];
var LOCATIONS = NATIONAL.concat(REGIONS).concat(STATES).concat(COUNTIES).concat(CITIES);
var ILI_SHARED = [// select state, count(1) from fluview_state group by state order by state
"AK", "AZ", "CA", "CO", "ID", "KS", "LA", "MD", "ME", "MS", "MT", "NC", "ND", "NE", "NH", "OH", "OR", "PA", "RI", "TN", "TX", "VA", "VI", "VT", "WI", "WV", "WY"];
var ILI_AVAILABLE = [// select state, count(1) from state_ili group by state order by state
"AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FL", "GA", "IA", "ID", "IL", "IN", "KS", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "RI", "SC", "SD", "TN", "TX", "VT", "WI", "WV", "WY"];
var NAMES = {
    FL: "Florida",
    cen4: "West North Central",
    hhs9: "HHS Region 9",
    MT: "Montana",
    WV: "West Virginia",
    RI: "Rhode Island",
    AR: "Arkansas",
    VA: "Virginia",
    cen7: "West South Central",
    IN: "Indiana",
    NC: "North Carolina",
    IA: "Iowa",
    MN: "Minnesota",
    cen2: "Middle Atlantic",
    DE: "Delaware",
    PA: "Pennsylvania",
    hhs7: "HHS Region 7",
    nat: "US National",
    hhs10: "HHS Region 10",
    LA: "Louisiana",
    MD: "Maryland",
    AK: "Alaska",
    CO: "Colorado",
    WI: "Wisconsin",
    ID: "Idaho",
    OK: "Oklahoma",
    hhs3: "HHS Region 3",
    hhs2: "HHS Region 2",
    hhs1: "HHS Region 1",
    cen1: "New England",
    KY: "Kentucky",
    ME: "Maine",
    CA: "California",
    cen5: "South Atlantic",
    WY: "Wyoming",
    ND: "North Dakota",
    NY: "New York",
    MA: "Massachusetts",
    UT: "Utah",
    DC: "District of Columbia",
    MS: "Mississippi",
    hhs6: "HHS Region 6",
    GA: "Georgia",
    AL: "Alabama",
    HI: "Hawaii",
    hhs4: "HHS Region 4",
    AZ: "Arizona",
    CT: "Connecticut",
    KS: "Kansas",
    NH: "New Hampshire",
    cen8: "Mountain",
    TX: "Texas",
    NV: "Nevada",
    TN: "Tennessee",
    NJ: "New Jersey",
    MI: "Michigan",
    hhs8: "HHS Region 8",
    NM: "New Mexico",
    IL: "Illinois",
    cen3: "East North Central",
    VT: "Vermont",
    WA: "Washington",
    SD: "South Dakota",
    NE: "Nebraska",
    hhs5: "HHS Region 5",
    SC: "South Carolina",
    cen6: "East South Central",
    OR: "Oregon",
    cen9: "Pacific",
    MO: "Missouri",
    OH: "Ohio",
    //State additions:
    PR: "Puerto Rico",
    //CITIES:
    Albuquerque_NM:"Albuquerque",
    Arlington_TX:"Arlington",
    Atlanta_GA:"Atlanta",
    Austin_TX:"Austin",
    Baltimore_MD:"Baltimore",
    Boston_MA:"Boston",
    Charlotte_NC:"Charlotte",
    Chicago_IL:"Chicago",
    Cleveland_OH:"Cleveland",
    Colorado_Springs_CO:"Colorado Springs",
    Columbus_OH:"Columbus",
    Dallas_TX:"Dallas",
    Denver_CO:"Denver",
    Detroit_MI:"Detroit",
    El_Paso_TX:"El Paso",
    FtWorth_TX:"Fort Worth",
    Fresno_CA:"Fresno",
    Houston_TX:"Houston",
    Indianapolis_IN:"Indianapolis",
    Jacksonville_FL:"Jacksonville",
    Kansas_City_MO:"Kansas City",
    Las_Vegas_NV:"Las Vegas",
    Long_Beach_CA:"Long Beach",
    /*Los_Angeles_CA:*/lax:"Los Angeles",
    Louisville_Jefferson_County_KY:"Louisville-Jefferson County",
    Memphis_TN:"Memphis",
    Mesa_AZ:"Mesa",
    Miami_FL:"Miami",
    Milwaukee_WI:"Milwaukee",
    Minneapolis_MN:"Minneapolis",
    Nashville_Davidson_TN:"Nashville-Davidson",
    New_Orleans_LA:"New Orleans",
    /*New_York_NY:*/jfk:"New York City",
    Oakland_CA:"Oakland",
    Oklahoma_City_OK:"Oklahoma City",
    Omaha_NE:"Omaha",
    Philadelphia_PA:"Philadelphia",
    Phoenix_AZ:"Phoenix",
    /*Pittsburgh_PA:*/pit:"Pittsburgh",
    Portland_OR:"Portland",
    Raleigh_NC:"Raleigh",
    Sacramento_CA:"Sacramento",
    San_Antonio_TX:"San Antonio",
    San_Diego_CA:"San Diego",
    San_Francisco_CA:"San Francisco",
    San_Jose_CA:"San Jose",
    Seattle_WA:"Seattle",
    Tucson_AZ:"Tucson",
    Tulsa_OK:"Tulsa",
    Virginia_Beach_VA:"Virginia Beach",
    Washington_DC:"Washington",
    Wichita_KS:"Wichita",
};

var REGION2STATE = {
    hhs1: ["ME", "MA", "NH", "VT", "RI", "CT"],
    hhs2: ["NY", "NJ"],
    hhs3: ["PA", "DE", "DC", "MD", "VA", "WV"],
    hhs4: ["NC", "SC", "GA", "FL", "KY", "TN", "MS", "AL"],
    hhs5: ["MI", "IL", "IN", "OH", "WI", "MN"],
    hhs6: ["LA", "AR", "OK", "TX", "NM"],
    hhs7: ["IA", "MO", "NE", "KS"],
    hhs8: ["ND", "SD", "CO", "WY", "MT", "UT"],
    hhs9: ["NV", "CA", "HI", "AZ"],
    hhs10: ["WA", "OR", "AK", "ID"],
    cen1: ["ME", "MA", "NH", "VT", "RI", "CT"],
    cen2: ["PA", "NY", "NJ"],
    cen3: ["WI", "MI", "IN", "IL", "OH"],
    cen4: ["ND", "SD", "NE", "KS", "MN", "IA", "MO"],
    cen5: ["DE", "MD", "DC", "WV", "VA", "NC", "SC", "GA", "FL"],
    cen6: ["KY", "TN", "MS", "AL"],
    cen7: ["OK", "AR", "LA", "TX"],
    cen8: ["MT", "ID", "WY", "CO", "UT", "NV", "AZ", "NM"],
    cen9: ["WA", "OR", "CA", "AK", "HI"]
};

var POPULATION = {
    AK: 731449,
    AL: 4822023,
    AR: 2949131,
    AZ: 6553255,
    CA: 38041430,
    CO: 5187582,
    CT: 3590347,
    DC: 632323,
    DE: 917092,
    FL: 19317568,
    GA: 9919945,
    HI: 1392313,
    IA: 3074186,
    ID: 1595728,
    IL: 12875255,
    IN: 6537334,
    KS: 2885905,
    KY: 4380415,
    LA: 4601893,
    MA: 6646144,
    MD: 5884563,
    ME: 1329192,
    MI: 9883360,
    MN: 5379139,
    MO: 6021988,
    MS: 2984926,
    MT: 1005141,
    NC: 9752073,
    ND: 699628,
    NE: 1855525,
    NH: 1320718,
    NJ: 8864590,
    NM: 2085538,
    NV: 2758931,
    NY: 19570261,
    OH: 11544225,
    OK: 3814820,
    OR: 3899353,
    PA: 12763536,
    RI: 1050292,
    SC: 4723723,
    SD: 833354,
    TN: 6456243,
    TX: 26059203,
    UT: 2855287,
    VA: 8185867,
    VT: 626011,
    WA: 6897012,
    WI: 5726398,
    WV: 1855413,
    WY: 576412,
    PR: 3337000
};

var global_epiweek;

// Non-Influennza Week Calculation
//var NON_INFLUENZA_WEEK_SEASON = 2015;

/*
* /Define Constants
*/

/*
* Calculations
*/

//Calculate mean
var calculateMean = function calculateMean(values) {
    var sum = 0;
    for (var _iterator3 = Array.from(values), _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator](); ; ) {
        var _ref;

        if (_isArray3) {
            if (_i4 >= _iterator3.length)
                break;
            _ref = _iterator3[_i4++];
        } else {
            _i4 = _iterator3.next();
            if (_i4.done)
                break;
            _ref = _i4.value;
        }

        var v = _ref;

        sum += v;
    }
    return sum / values.length;
};

//Calculate standard deviation
var calculateStdev = function calculateStdev(values, mean) {
    var sum = 0;
    for (var _iterator4 = Array.from(values), _isArray4 = Array.isArray(_iterator4), _i5 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator](); ; ) {
        var _ref2;

        if (_isArray4) {
            if (_i5 >= _iterator4.length)
                break;
            _ref2 = _iterator4[_i5++];
        } else {
            _i5 = _iterator4.next();
            if (_i5.done)
                break;
            _ref2 = _i5.value;
        }

        var v = _ref2;

        sum += Math.pow(v - mean, 2);
    }
    return Math.pow(sum / (values.length - 1), 0.5);
};

//Calculate non-influenza data based on season
var calculateNonInfluenzaData = function calculateNonInfluenzaData(epidata, season) {
    var NonInfluenzaData = {};
    var mappedData = {};
    for (var _iterator5 = Array.from(LOCATIONS), _isArray5 = Array.isArray(_iterator5), _i6 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator](); ; ) {
        var _ref3;

        if (_isArray5) {
            if (_i6 >= _iterator5.length)
                break;
            _ref3 = _iterator5[_i6++];
        } else {
            _i6 = _iterator5.next();
            if (_i6.done)
                break;
            _ref3 = _i6.value;
        }

        var loc = _ref3;

        mappedData[loc] = {};
    }
    for (var _iterator6 = Array.from(epidata), _isArray6 = Array.isArray(_iterator6), _i7 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator](); ; ) {
        var _ref4;

        if (_isArray6) {
            if (_i7 >= _iterator6.length)
                break;
            _ref4 = _iterator6[_i7++];
        } else {
            _i7 = _iterator6.next();
            if (_i7.done)
                break;
            _ref4 = _i7.value;
        }

        var row = _ref4;

        var wk = row.epiweek % 100;
        mappedData[row.location][wk] = row.value;
    }
    for (var _iterator7 = Array.from(HHS_REGIONS), _isArray7 = Array.isArray(_iterator7), _i8 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator](); ; ) {
        var _ref5;

        if (_isArray7) {
            if (_i8 >= _iterator7.length)
                break;
            _ref5 = _iterator7[_i8++];
        } else {
            _i8 = _iterator7.next();
            if (_i8.done)
                break;
            _ref5 = _i8.value;
        }

        var region = _ref5;

        var weeks = nonInfluenzaWeekData[season][region];
        for (var _iterator8 = Array.from(REGION2STATE[region]), _isArray8 = Array.isArray(_iterator8), _i9 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator](); ; ) {
            var _ref6;

            if (_isArray8) {
                if (_i9 >= _iterator8.length)
                    break;
                _ref6 = _iterator8[_i9++];
            } else {
                _i9 = _iterator8.next();
                if (_i9.done)
                    break;
                _ref6 = _i9.value;
            }

            var state = _ref6;

            var values = [];
            for (var _iterator9 = Array.from(weeks), _isArray9 = Array.isArray(_iterator9), _i10 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator](); ; ) {
                var _ref7;

                if (_isArray9) {
                    if (_i10 >= _iterator9.length)
                        break;
                    _ref7 = _iterator9[_i10++];
                } else {
                    _i10 = _iterator9.next();
                    if (_i10.done)
                        break;
                    _ref7 = _i10.value;
                }

                var week = _ref7;

                values.push(mappedData[state][week]);
            }
            var mean = calculateMean(values);
            var stdev = calculateStdev(values, mean);
            NonInfluenzaData[state] = [mean, stdev];
        }
    }
    return NonInfluenzaData;
};

// Date formatting
Date.prototype.getWeek = function() {
    var stdDate = new Date(2016,0,3);
    var rst = Math.ceil(((this - stdDate) / 86400000 + stdDate.getDay() + 1) / 7) % 52;
    if (rst === 0) {
        return 52;
    }
    return rst;
};

var date2String = function date2String(date) {
    return (MONTHS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
};

var epiweek2date = function epiweek2date(epiweek) {
    var stdDate = new Date(2016,0,3);
    var wk = epiweek % 100;
    var yr = Math.floor(epiweek / 100);
    var increment = ((yr - 2016) * 52 + wk - 1) * 7;
    stdDate.setDate(stdDate.getDate() + increment);
    return stdDate;
};

var epiweekOffByTen = function epiweekOffByTen(epiweek) {
    var _Array$from14 = Array.from([epiweek, epiweek])
      , previousWeek = _Array$from14[0]
      , nextWeek = _Array$from14[1];

    for (i = 0; i < 10; i++) {
        var _ = void 0;

        var _Array$from15 = Array.from(epiweekOffByOne(previousWeek));

        previousWeek = _Array$from15[0];
        _ = _Array$from15[1];

        var _Array$from16 = Array.from(epiweekOffByOne(nextWeek));

        _ = _Array$from16[0];
        nextWeek = _Array$from16[1];
    }
    return [previousWeek, nextWeek];
};

var epiweekOffByOne = function epiweekOffByOne(epiweek) {
    var wk = epiweek % 100;
    var yr = Math.floor(epiweek / 100);
    var previousWeek = epiweek - 1;
    var nextWeek = epiweek + 1;
    if (wk === 1) {
        previousWeek = (yr - 1) * 100 + 52;
    }
    if (wk === 52) {
        nextWeek = (yr + 1) * 100 + 1;
    }
    return [previousWeek, nextWeek];
};

// Format formalities
var getFakeRow = function getFakeRow(location, i) {
    return {
        location: location,
        epiweek: 201201 + 100 * Math.floor(i / 52) + (i % 52),
        value: 1 + Math.random() * 3,
        std: 0.5 + Math.random() * 1,
        wili: 1 + Math.random() * 3
    };
};

var normalizeCase = function normalizeCase(loc) {
    // states should be upper case, regions should be lower case
    if (loc.length === 2) {
        return loc.toUpperCase();
    } else {
        return loc.toLowerCase();
    }
};

//Debug Epidata if parameters are not found
var getEpidataHander = function getEpidataHander(callback) {
    return function(result, message, epidata) {
        if (result === 1) {
            // normalize the case of locations
            for (var _iterator17 = Array.from(epidata), _isArray17 = Array.isArray(_iterator17), _i18 = 0, _iterator17 = _isArray17 ? _iterator17 : _iterator17[Symbol.iterator](); ; ) {
                var _ref11;

                if (_isArray17) {
                    if (_i18 >= _iterator17.length)
                        break;
                    _ref11 = _iterator17[_i18++];
                } else {
                    _i18 = _iterator17.next();
                    if (_i18.done)
                        break;
                    _ref11 = _i18.value;
                }

                var row = _ref11;

                if (row.location != null) {
                    // the nowcast response
                    row.location = normalizeCase(row.location);
                }
                if (row.region != null) {
                    // the fluview response
                    row.region = normalizeCase(row.region);
                }
            }
            // invoke the supplied callback
            return callback(epidata);
        } else {
            var msg = "The Epidata API says '" + message + "'. (error #" + result + ")";
            console.log(msg);
            //return alert(msg);
        }
    }
    ;
};

// Render approximations of ILI

//Fluview
var Epidata_fluview_single = function Epidata_fluview_single(handler, location, epiweeks) {
    if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.fluview : undefined) != null) {
        return Epidata.fluview(handler, location, epiweeks);
    } else {
        var fakeData = (function() {
            var result = [];
            for (i = 0; i < 280; i++) {
                result.push(getFakeRow(location, i));
            }
            return result;
        }
        )();
        var callback = function callback() {
            return handler(1, "debug", fakeData);
        };
        var delay = 250 + Math.round(Math.random() * 500);
        return window.setTimeout(callback, delay);
    }
};

//Nowcast
var Epidata_nowcast_single = function Epidata_nowcast_single(handler, location) {
    if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.nowcast : undefined) != null) {
        return Epidata.nowcast(handler, location, "201130-202030");
    } else {
        var fakeData = (function() {
            var result = [];
            for (i = 0; i < 280; i++) {
                result.push(getFakeRow(location, i));
            }
            return result;
        }
        )();
        var callback = function callback() {
            return handler(1, "debug", fakeData);
        };
        var delay = 250 + Math.round(Math.random() * 500);
        return window.setTimeout(callback, delay);
    }
};

//Multi

var Epidata_nowcast_multi = function Epidata_nowcast_multi(handler, locations, epiweek1, epiweek2) {
    if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.nowcast : undefined) != null) {
        // TODO: The following statement needs debugging
        //return Epidata.nowcast(handler, locations, Epidata.range(epiweek1, epiweek2));
        return Epidata.nowcast(handler, locations, "201801-202052");
    } else {
        var fakeData = [];
        for (var _iterator18 = Array.from(locations), _isArray18 = Array.isArray(_iterator18), _i19 = 0, _iterator18 = _isArray18 ? _iterator18 : _iterator18[Symbol.iterator](); ; ) {
            var _ref12;

            if (_isArray18) {
                if (_i19 >= _iterator18.length)
                    break;
                _ref12 = _iterator18[_i19++];
            } else {
                _i19 = _iterator18.next();
                if (_i19.done)
                    break;
                _ref12 = _i19.value;
            }

            var location = _ref12;

            for (i = 0; i < 280; i++) {
                fakeData.push(getFakeRow(location, i));
            }
        }
        var callback = function callback() {
            return handler(1, "debug", fakeData);
        };
        var delay = 250 + Math.round(Math.random() * 500);
        return window.setTimeout(callback, delay);
    }
};

//Define App
function App() {};
window.App = App = (function() {
    //var PAGE_MAP = undefined;
    var PAGE_CHART = undefined;
    App = (function() {
        App.initClass = function initClass() {
            //PAGE_MAP = 0;
            PAGE_CHART = 1;
        };

        function App() {
            var _this2 = this;

            var clicker = function clicker(name, locations) {
                return function() {
                    $(".button_group0 i").removeClass("fa-dot-circle-o");
                    $(".button_group0 i").addClass("fa-circle-o");
                    $("#button_view_" + name + " i").removeClass("fa-circle-o");
                    $("#button_view_" + name + " i").addClass("fa-dot-circle-o");
                    return _this2.setLocations(locations);
                }
                ;
            };
            // TODO: Move the following into pointerinput

            var _Array$from21 = Array.from([-1, -1, -1, -1, -1, -1, -1, -1])
              , xs0 = _Array$from21[0]
              , xs1 = _Array$from21[1]
              , xe2 = _Array$from21[2]
              , xe3 = _Array$from21[3]
              , ys0 = _Array$from21[4]
              , ys1 = _Array$from21[5]
              , ye2 = _Array$from21[6]
              , ye3 = _Array$from21[7];

            var isPinching = false;
            var pinchZoom = function pinchZoom() {
                var d1 = Math.pow(Math.pow(xs0 - xs1, 2) + Math.pow(ys0 - ys1, 2), 0.5);
                var d2 = Math.pow(Math.pow(xe2 - xe3, 2) + Math.pow(ye2 - ye3, 2), 0.5);
                if (d1 > d2) {
                    return _this2.zoomOut();
                } else {
                    return _this2.zoomIn();
                }
            };
            var pinchend = function pinchend(e) {
                if (isPinching) {
                    if (e.originalEvent.changedTouches.length === 2) {
                        xe2 = e.originalEvent.changedTouches[0].pageX;
                        xe3 = e.originalEvent.changedTouches[1].pageX;
                        ye2 = e.originalEvent.changedTouches[0].pageY;
                        ye3 = e.originalEvent.changedTouches[1].pageY;
                        isPinching = false;
                        pinchZoom();
                    }
                    if (e.originalEvent.changedTouches.length === 1) {
                        if (xe2 < 0) {
                            xe2 = e.originalEvent.changedTouches[0].pageX;
                            return (ye2 = e.originalEvent.changedTouches[0].pageY);
                        } else {
                            xe3 = e.originalEvent.changedTouches[0].pageX;
                            ye3 = e.originalEvent.changedTouches[0].pageY;
                            isPinching = false;
                            return pinchZoom();
                        }
                    }
                }
            };
            var pinchstart = function pinchstart(e) {
                if (e.originalEvent.targetTouches.length === 2) {
                    isPinching = true;

                    var _Array$from22 = Array.from([-1, -1, -1, -1, -1, -1, -1, -1]);

                    xs0 = _Array$from22[0];
                    xs1 = _Array$from22[1];
                    xe2 = _Array$from22[2];
                    xe3 = _Array$from22[3];
                    ys0 = _Array$from22[4];
                    ys1 = _Array$from22[5];
                    ye2 = _Array$from22[6];
                    ye3 = _Array$from22[7];

                    xs0 = e.originalEvent.targetTouches[0].pageX;
                    xs1 = e.originalEvent.targetTouches[1].pageX;
                    ys0 = e.originalEvent.targetTouches[0].pageY;
                    return (ys1 = e.originalEvent.targetTouches[1].pageY);
                }
            };
            // HTML Render calls
            // Layers are already being controlled by Leaflet map layer control
            /*
            $("#button_view_nat").click(clicker("nat", NATIONAL));
            $("#button_view_hhs").click(clicker("hhs", HHS_REGIONS));
            $("#button_view_cen").click(clicker("cen", CENSUS_REGIONS));
            $("#button_view_sta").click(clicker("sta", STATES));
            $("#button_zoom_in").click(function() {
                return _this2.zoomIn();
            });
            $("#button_zoom_out").click(function() {
                return _this2.zoomOut();
            });
            */
            // /HTML Render calls

            this.dataTimeline = $("#dataTimeline");

            //Added code
            //this.currentPage = PAGE_MAP;
            //this.nonInfluenzaWeekSeason = NON_INFLUENZA_WEEK_SEASON;
            this.setLocations(STATES);
            //this.resetView();
            this.loadEpidata();
            this.currentDetailedLoc = null;
            this.keyPressLock = 0;
            $(document).keydown(function(e) {
                if (_this2.keyPressLock === 0) {
                    var _ = void 0
                      , wk = void 0;
                    if (e.keyCode === 37) {
                        _this2.keyPressLock = 1;

                        var _Array$from23 = Array.from(epiweekOffByOne(_this2.currentEpweek));

                        _this2.currentEpweek = _Array$from23[0];
                        _ = _Array$from23[1];

                        wk = _this2.currentEpweek % 100;
                        if (wk === 39) {
                            _this2.nonInfluenzaWeekSeason = _this2.nonInfluenzaWeekSeason - 1;
                        }
                        _this2.loadEpidata(_this2.currentEpweek);
                        if (_this2.currentDetailedLoc != null) {
                            _this2.fetchNowcast(_this2.currentDetailedLoc, _this2.currentEpweek);
                        }
                    }
                    if (e.keyCode === 38) {
                        if (_this2.currentEpweek < _this2.maxEpiweek) {
                            _this2.keyPressLock = 1;

                            var _Array$from24 = Array.from(epiweekOffByTen(_this2.currentEpweek));

                            _ = _Array$from24[0];
                            _this2.currentEpweek = _Array$from24[1];

                            _this2.currentEpweek = Math.min(_this2.currentEpweek, _this2.maxEpiweek);
                            wk = _this2.currentEpweek % 100;
                            if (50 > wk && wk >= 40) {
                                _this2.nonInfluenzaWeekSeason = _this2.nonInfluenzaWeekSeason + 1;
                            }
                            _this2.loadEpidata(_this2.currentEpweek);
                            if (_this2.currentDetailedLoc != null) {
                                _this2.fetchNowcast(_this2.currentDetailedLoc, _this2.currentEpweek);
                            }
                        } else {
                            wk = _this2.maxEpiweek % 100;
                            alert("Week" + wk + " is the lastest data we had! Please check back next week!");
                        }
                    }
                    if (e.keyCode === 39) {
                        if (_this2.currentEpweek < _this2.maxEpiweek) {
                            _this2.keyPressLock = 1;

                            var _Array$from25 = Array.from(epiweekOffByOne(_this2.currentEpweek));

                            _ = _Array$from25[0];
                            _this2.currentEpweek = _Array$from25[1];

                            wk = _this2.currentEpweek % 100;
                            if (wk === 40) {
                                _this2.nonInfluenzaWeekSeason = _this2.nonInfluenzaWeekSeason + 1;
                            }
                            _this2.loadEpidata(_this2.currentEpweek);
                            if (_this2.currentDetailedLoc != null) {
                                _this2.fetchNowcast(_this2.currentDetailedLoc, _this2.currentEpweek);
                            }
                        } else {
                            wk = _this2.maxEpiweek % 100;
                            alert("Week" + wk + " is the lastest data we had! Please check back next week!");
                        }
                    }
                    if (e.keyCode === 40) {
                        _this2.keyPressLock = 1;

                        var _Array$from26 = Array.from(epiweekOffByTen(_this2.currentEpweek));

                        _this2.currentEpweek = _Array$from26[0];
                        _ = _Array$from26[1];

                        wk = _this2.currentEpweek % 100;
                        if (40 > wk && wk > 29) {
                            _this2.nonInfluenzaWeekSeason = _this2.nonInfluenzaWeekSeason - 1;
                        }
                        _this2.loadEpidata(_this2.currentEpweek);
                        if (_this2.currentDetailedLoc != null) {
                            return _this2.fetchNowcast(_this2.currentDetailedLoc, _this2.currentEpweek);
                        }
                    }
                }
            });

            /* Unnecessary as backToHome is handled by Nav
              window.onpopstate = function(e) {
                  return _this2.backToHome();
              };
              $("#back_arrow").click(function(e) {
                  return window.history.back();
              });
              */
        }

        // Load Epidata
        App.prototype.loadEpidata = function loadEpidata() {
            var _this3 = this;

            var epweek = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var callback1 = void 0
              , date = void 0
              , datestr = void 0
              , epiweek1 = void 0
              , epiweek2 = void 0
              , handler = void 0;
            if (epweek != null) {
                var _ = void 0;
                epiweek2 = epweek;

                var _Array$from27 = Array.from(epiweekOffByOne(epiweek2));

                epiweek1 = _Array$from27[0];
                _ = _Array$from27[1];

                date = epiweek2date(epiweek2);
                datestr = "(" + date2String(date);
                date.setDate(date.getDate() + 6);
                datestr = datestr + "-" + date2String(date) + ")";
                this.dataTimeline.html("");
                this.currentEpweek = epiweek2;
                callback1 = function callback1(epidata) {
                    var NonInfluenzaData = calculateNonInfluenzaData(epidata, _this3.nonInfluenzaWeekSeason);
                    var callback2 = function callback2(epidata) {
                        _this3.colors = {};
                        _this3.mapData = {};
                        //var colorData = calculateColor(NonInfluenzaData, epidata, epiweek2);
                        for (var _iterator19 = Array.from(epidata), _isArray19 = Array.isArray(_iterator19), _i20 = 0, _iterator19 = _isArray19 ? _iterator19 : _iterator19[Symbol.iterator](); ; ) {
                            var _ref13;

                            if (_isArray19) {
                                if (_i20 >= _iterator19.length)
                                    break;
                                _ref13 = _iterator19[_i20++];
                            } else {
                                _i20 = _iterator19.next();
                                if (_i20.done)
                                    break;
                                _ref13 = _i20.value;
                            }

                            var row = _ref13;

                            if (row.epiweek === epiweek2) {
                                var ili = row.value;
                                var v = colorData[row.location];
                                var c = ("0" + Math.round(0x3f + v * 0xc0).toString(16)).slice(-2);
                                _this3.colors[row.location] = "#" + c + "4040";
                                _this3.mapData[row.location] = row;
                            }
                        }
                        //Display nowcasting week on map app
                        global_epiweek = epiweek2
                        _this3.dataTimeline.html("Nowcasting epi-week " + (epiweek2 % 100) + " " + datestr);
                        if (_this3.keyPressLock === 1) {
                            return (_this3.keyPressLock = 0);
                        }
                    };
                    var handler = getEpidataHander(callback2);
                    return Epidata_nowcast_multi(handler, LOCATIONS, epiweek1, epiweek2);
                }
                ;
                handler = getEpidataHander(callback1);
                return Epidata_nowcast_multi(handler, STATES, this.nonInfluenzaWeekSeason * 100 + 40, (this.nonInfluenzaWeekSeason + 1) * 100 + 39);
            } else {
                var callback = function callback(epidata) {
                    epiweek1 = epidata[epidata.length - 4].epiweek;
                    epiweek2 = epidata[epidata.length - 1].epiweek;
                    _this3.maxEpiweek = epiweek2;
                    date = epiweek2date(epiweek2);
                    datestr = "(" + date2String(date);
                    date.setDate(date.getDate() + 6);
                    datestr = datestr + "-" + date2String(date) + ")";
                    global_epiweek = epiweek2
                    _this3.dataTimeline.html("Nowcasting epi-week " + (epiweek2 % 100) + " " + datestr);
                    _this3.currentEpweek = epiweek2;
                    callback1 = function callback1(epidata) {
                        var NonInfluenzaData = calculateNonInfluenzaData(epidata, _this3.nonInfluenzaWeekSeason);
                        var callback2 = function callback2(epidata) {
                            _this3.colors = {};
                            _this3.mapData = {};
                            //var colorData = calculateColor(NonInfluenzaData, epidata, epiweek2);
                            for (var _iterator20 = Array.from(epidata), _isArray20 = Array.isArray(_iterator20), _i21 = 0, _iterator20 = _isArray20 ? _iterator20 : _iterator20[Symbol.iterator](); ; ) {
                                var _ref14;

                                if (_isArray20) {
                                    if (_i21 >= _iterator20.length)
                                        break;
                                    _ref14 = _iterator20[_i21++];
                                } else {
                                    _i21 = _iterator20.next();
                                    if (_i21.done)
                                        break;
                                    _ref14 = _i21.value;
                                }

                                var row = _ref14;

                                if (row.epiweek === epiweek2) {
                                    var ili = row.value;
                                    var v = colorData[row.location];
                                    var c = ("0" + Math.round(0x3f + v * 0xc0).toString(16)).slice(-2);
                                    _this3.colors[row.location] = "#" + c + "4040";
                                    _this3.mapData[row.location] = row;
                                }
                            }
                        };
                        handler = getEpidataHander(callback2);
                        return Epidata_nowcast_multi(handler, LOCATIONS, epiweek1, epiweek2);
                    }
                    ;
                    handler = getEpidataHander(callback1);
                    return Epidata_nowcast_multi(handler, STATES, _this3.nonInfluenzaWeekSeason * 100 + 40, (_this3.nonInfluenzaWeekSeason + 1) * 100 + 39);
                };
                handler = getEpidataHander(callback);
                return Epidata_nowcast_single(handler, "nat");
            }
        };

        // Show location details
        App.prototype.showLocationDetails = function showLocationDetails(loc) {
            var needle = void 0;
            this.currentPage = PAGE_CHART;
            history.pushState({}, "");
            $("#location_name").html(NAMES[loc]);
            $(".achievement_holder").hide();
            $(".achievement_holder_top").hide();
            $(".ili_note").hide();
            if (((needle = loc.toUpperCase()),
            Array.from(STATES).includes(needle))) {
                var needle1 = void 0
                  , needle2 = void 0;
                $("#state_note").show();
                $("#state_note_left").show();
                $("#location_google1").show();
                $("#location_twitter1").show();
                $("#location_wiki0").show();
                $("#location_cdc1").show();
                $("#location_epicast0").show();
                $("#location_arch0").show();
                $("#location_sar30").show();
                if (((needle1 = loc.toUpperCase()),
                Array.from(ILI_AVAILABLE).includes(needle1))) {
                    $("#location_star1").show();
                } else {
                    $("#location_star0").show();
                }
                if (((needle2 = loc.toUpperCase()),
                Array.from(ILI_SHARED).includes(needle2))) {
                    $("#location_heart1").show();
                } else {
                    $("#location_heart0").show();
                }
            }
            if (Array.from(HHS_REGIONS).includes(loc)) {
                $("#hhs_note").show();
                $("#hhs_note_left").show();
                $("#location_google0").show();
                $("#location_twitter1").show();
                $("#location_wiki0").show();
                $("#location_cdc1").show();
                $("#location_epicast1").show();
                $("#location_arch1").show();
                $("#location_sar31").show();
            }
            if (Array.from(CENSUS_REGIONS).includes(loc)) {
                $("#location_google0").show();
                $("#location_twitter1").show();
                $("#location_wiki0").show();
                $("#location_cdc1").show();
                $("#location_epicast0").show();
                $("#location_arch1").show();
                $("#location_sar31").show();
            }
            if (loc === "nat") {
                $("#location_google1").show();
                $("#location_twitter1").show();
                $("#location_wiki1").show();
                $("#location_cdc1").show();
                $("#location_epicast1").show();
                $("#location_arch1").show();
                $("#location_sar31").show();
            }
            $(".location_right").css("display", "none");
            //$("#loading_icon").css("display", "flex");
            //$(".pages").animate({left: "-100%"}, 125); //Animation is being done on main CSS file
            this.currentDetailedLoc = loc;
            return this.fetchNowcast(loc, this.currentEpweek);
        };

        //Set Locations
        App.prototype.setLocations = function setLocations(locations) {
            this.locations = locations;
        };

        //Add event listener "if location is clicked show location details"
        /*
        App.prototype.onClick = function onClick(x, y) {
            var loc = this.hitTest(x, y);
            if (loc != null) {
                return this.showLocationDetails(loc);
            }
        };
        */

        //Add compatibility with Leaflet
        App.prototype.onClick = function onClick(feature, layer) {
            var loc = this.hitTest(x, y);
            if (loc != null) {
                return this.showLocationDetails(loc);
            }
        };

        //Iterate through the locations //Experimental
        //Geodata will need to be merged into one file or function
        var geodata = usData, statesData, countiesData, citiesData, censusData, hhsData; //experimental unify geoJSON locations

        App.prototype.hitTest = function hitTest(u, v) {
            for (var _iterator36 = Array.from(this.locations), _isArray36 = Array.isArray(_iterator36), _i37 = 0, _iterator36 = _isArray36 ? _iterator36 : _iterator36[Symbol.iterator](); ; ) {
                var _ref18;

                if (_isArray36) {
                    if (_i37 >= _iterator36.length)
                        break;
                    _ref18 = _iterator36[_i37++];
                } else {
                    _i37 = _iterator36.next();
                    if (_i37.done)
                        break;
                    _ref18 = _i37.value;
                }

                var loc = _ref18;

                for (var _iterator37 = Array.from(geodata.locations[loc].paths), _isArray37 = Array.isArray(_iterator37), _i38 = 0, _iterator37 = _isArray37 ? _iterator37 : _iterator37[Symbol.iterator](); ; ) {
                    if (_isArray37) {
                        if (_i38 >= _iterator37.length)
                            break;
                        poly = _iterator37[_i38++];
                    } else {
                        _i38 = _iterator37.next();
                        if (_i38.done)
                            break;
                        poly = _i38.value;
                    }

                    var hit = false;

                    var _Array$from37 = Array.from(this.ecef2ortho.apply(this, Array.from(geodata.points[poly[0]] || [])))
                      , u1 = _Array$from37[0]
                      , v1 = _Array$from37[1];

                    for (var idx = 1, end1 = poly.length, asc1 = 1 <= end1; asc1 ? idx <= end1 : idx >= end1; asc1 ? idx++ : idx--) {
                        var _Array$from38 = Array.from(this.ecef2ortho.apply(this, Array.from(geodata.points[poly[idx % poly.length]] || [])))
                          , u2 = _Array$from38[0]
                          , v2 = _Array$from38[1];

                        if (v1 > v !== v2 > v && (u1 > u || u2 > u) && ((u1 > u && u2 > u) || u1 + ((v - v1) * (u2 - u1)) / (v2 - v1) > u)) {
                            hit = !hit;
                        }

                        var _Array$from39 = Array.from([u2, v2]);

                        u1 = _Array$from39[0];
                        v1 = _Array$from39[1];
                    }
                    if (hit) {
                        return loc;
                    }
                }
            }
            return null;
        };

        //Fetch nowcast
        App.prototype.fetchNowcast = function fetchNowcast(loc, currentEpiweek) {
            var _this6 = this;

            this.chartData = null;
            this.truthData = null;
            var callback = function callback(epidata) {
                return _this6.onNowcastReceived(epidata, currentEpiweek);
            };
            return Epidata_nowcast_single(getEpidataHander(callback), loc);
        };

        App.prototype.onNowcastReceived = function onNowcastReceived(epidata, currentEpiweek) {
            var _this7 = this;

            var current = void 0
              , idx = void 0;
            for (var _iterator39 = Array.from(epidata), _isArray39 = Array.isArray(_iterator39), _i40 = 0, _iterator39 = _isArray39 ? _iterator39 : _iterator39[Symbol.iterator](); ; ) {
                var _ref19;

                if (_isArray39) {
                    if (_i40 >= _iterator39.length)
                        break;
                    _ref19 = _iterator39[_i40++];
                } else {
                    _i40 = _iterator39.next();
                    if (_i40.done)
                        break;
                    _ref19 = _i40.value;
                }

                var row = _ref19;

                if (row.epiweek === currentEpiweek) {
                    current = row;
                }
            }

            var start = epidata[0];
            end = epidata[epidata.length - 1];
            var wk = end.epiweek % 100;
            var yr = Math.floor(end.epiweek / 100);
            var endepiweek = end.epiweek - 10;
            if (wk > 40) {
                endepiweek = yr * 100 + 39;
            }
            if (wk < 20) {
                endepiweek = (yr - 1) * 100 + 39;
            }
            var loc = current.location;
            if (Array.from(REGIONS).includes(loc) || Array.from(NATIONAL).includes(loc)) {
                var callback = function callback(ilidata) {
                    return _this7.onFluviewReceived(ilidata);
                };
                Epidata_fluview_single(getEpidataHander(callback), loc, start.epiweek + "-" + endepiweek);
            }
            var ili = "" + Math.round(current.value * 100) / 100;

           /* Map Styling Start */

          //TODO: Debug the following in order to get background fill working on map
          //Test ILI:
          $("#ili_value").html(ili + "%");

          /*
          App.prototype.fillBg = function() {
            var l;
            //l = (ili - mean) / stdev;
            //l = (ili/15);
            l = ili;
            return l;
          };
          */

          App.prototype.fillBg = ili/15;

          level2Color = function(level) {
            return Math.max(0, Math.min(10, level)) / 10;
          };

          /* /Map Styling End */

            if (Array.from(ili).includes(".")) {
                ili += "00";
                idx = ili.indexOf(".");
                ili = ili.slice(0, idx + 3);
            } else {
                ili += ".00";
            }

            var std = "" + Math.round(current.std * 100) / 100;
            if (Array.from(std).includes(".")) {
                std += "00";
                idx = std.indexOf(".");
                std = std.slice(0, idx + 3);
            } else {
                std += ".00";
            }
            ili = "(" + ili + "&#177;" + std + ")";
            global_epiweek = current.epiweek
            var epiweek = current.epiweek % 100;
            this.chartData = epidata;
            $("#location_name").html(NAMES[loc]); //Experimental - add location name when
            $("#nowcast_label").text("ILI nowcast for " + loc + " for epi-week " + epiweek + ":");
            $("#nowcast_label_left").text("ILI nowcast for " + loc + " for epi-week " + epiweek + ":");
            $("#nowcast_value_map").html(ili + "%"); //Added element to the map
            $("#nowcast_value").html(ili + "%");
            $("#nowcast_value_left").html(ili + "%");
            $("#chart_label").text("Historical ILI nowcasts for " + loc + ":");
            $(".location_right").css("display", "block");
            $("#loading_icon").css("display", "none");
        };

        App.prototype.onFluviewReceived = function onFluviewReceived(ilidata) {
            this.truthData = ilidata;
        };

        return App;
    }
    )();
    App.initClass();
    return App;
}
)();

/*
* /Calculations
*/

/*
* Draw timeline series with data gathered from Epidata API
*/

//"DO NOT use strict";
function renderChart(regionID, epiweek) {
    //fetch data
    region_list = []
    region_list.push(regionID)
    epidata_range = [Epidata.range(201101, epiweek)] //get full history
    var callback = function callback(result, message, epidata) {
        //clear old chart
        d3.select('#chart').selectAll("*").remove()

	//convert epiweek values to dates
	for (var i=0; i<epidata.length; i++) {
            epidata[i].epiweek = epiweek2date(epidata[i].epiweek)
	}

        // Update Chart with Nowcast Epidata
        chart = d3_timeseries().addSerie(epidata, {
            x: "epiweek",
            y: "value",
            diff: "std"
        }, {
            interpolate: "linear",
            color: "#333",
        })

        // Update Chart with Ground Truth Data
        /* //Experimental
        chart = d3_timeseries().addSerie(truthData, {
            x: "epiweek",
            y: "value",
            diff: "std"
        }, {
            interpolate: "linear",
            color: "#57aee7",
        })
        */

          .width(820)
          .height(350)

        chart("#chart");
      };

    Epidata.nowcast(callback, region_list, epidata_range);

    //Resize time-line series based on device
    //TODO: Needs debugging
    window.addEventListener('resize', function(event) {
      // get the width of the screen after the resize event
      var width = document.documentElement.clientWidth;
      // tablets are between 768 and 922 pixels wide
      // phones are less than 768 pixels wide
      if (width < 768) {
          // Set chart width to small
          chart.width(320);

      } else {
          // Set chart height to normal
          chart.height(400);
      }
    });
}

/*
* /Draw timeline series with data gathered from Epidata API
*/
