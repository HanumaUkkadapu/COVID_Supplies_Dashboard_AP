import { distConv, loadJSON } from "./script.js";

// ----------siva---------------
class placeHolderObj {
    constructor() {
        this.all = [];
        this.available = [];
        this.ICU = [];
        this["with oxygen"] = [];
        this["ICU with ventilator"] = [];
        this.Government = [];
        this.Arogyasri = [];
        this.Private = [];
    }
}

let totalData,
    hspSect,
    hspDataWrap,
    hspFilterIns,
    hspFilterBtn,
    hspClrFilterBtn,
    hspSelFilters = [];

let hspFilterDistrict = {
    Anantapur: new placeHolderObj(),
    Chittoor: new placeHolderObj(),
    "East godavari": new placeHolderObj(),
    Guntur: new placeHolderObj(),
    Krishna: new placeHolderObj(),
    Kurnool: new placeHolderObj(),
    Prakasam: new placeHolderObj(),
    "Spsr nellore": new placeHolderObj(),
    Srikakulam: new placeHolderObj(),
    Visakhapatanam: new placeHolderObj(),
    Vizianagaram: new placeHolderObj(),
    "West godavari": new placeHolderObj(),
    "Y.s.r.": new placeHolderObj(),
};

// Use the above function to load your JSON data.

// Use the function like shown below
let url_1 = `https://covidaps.com/data/covidaps.com/bed_data.json`;
loadJSON(url_1).then((data) => {
    // console.log(data);
    totalData = data;
    // console.log(getadistrict);
    filterHspData(data);
});

function filterHspData(hospitalList) {
    totalData = [...hospitalList];
    // console.log(totalData);

    hospitalList.forEach((e, ind) => {
        hspFilterDistrict[e.district]["all"].push(ind);
        // console.log(e.charges, ind);
        if (e.charges == "Private" || e.charges == "Partially Empanelled") {
            hspFilterDistrict[e.district]["Private"].push(ind);
        } else if (e.charges == "Government" || e.charges == "Arogyasri") {
            hspFilterDistrict[e.district][e.charges].push(ind);
        }
        if (
            e.available_icu_beds_without_ventilator > 0 ||
            e.available_beds_with_oxygen > 0 ||
            e.available_beds_without_oxygen > 0 ||
            e.available_icu_beds_with_ventilator > 0
        )
            hspFilterDistrict[e.district]["available"].push(ind);
        if (e.available_beds_with_oxygen > 0)
            hspFilterDistrict[e.district]["with oxygen"].push(ind);
        if (e.available_icu_beds_with_ventilator > 0)
            hspFilterDistrict[e.district]["ICU with ventilator"].push(ind);
        if (e.available_icu_beds_without_ventilator > 0)
            hspFilterDistrict[e.district]["ICU"].push(ind);
    });

    // console.log(hspFilterDistrict);
}

function putHSPHeaderData(hspSect, distName) {
    // console.log(distName);
    let sectCont = `<div class="container flex-cc col">
    <h3 class="resSectHead">
        Hospitals - <span>${distConv[distName]}</span>
    </h3>
    
    <!-- filters -->
    <div class="filters flex-cc">
        <ul class="noBullets flex-cc col">
            <div class="flex-cc" >
                Beds: 
                <li><label>Available<input type="checkbox" value="available"></label></li>
                <li><label>With Oxygen<input type="checkbox" value="with oxygen"></label></li>
                <li><label>ICU<input type="checkbox" value="ICU"></label></li>
                <li><label>ICU + Ventilator<input type="checkbox" value="ICU with ventilator"></label></li>
            </div>
            <div class="flex-cc" >
                Hospital Type: 
                <li><label>Government<input type="checkbox" value="Government"></label></li>
                <li><label>Arogyasri<input type="checkbox" value="Arogyasri"></label></li>
                <li><label>Private<input type="checkbox" value="Private"></label></li>
            </div>
        </ul>
        <div class="fltrBtnDiv flex-cc col">
            <button class="filterBtn flex-cc" id="hspFilterBtn" >Filter</button>
            <button class="clrFilterBtn flex-cc" id="hspClrFilterBtn" >Clear Filters</button>
        </div>
    </div>

    <div id="hospitalData" class="flex-cc col">
       
    </div>
</div>`;
    hspSect.insertAdjacentHTML("beforeend", sectCont);
}

function getDistrictData(distName) {
    let getDist = distName;
    let arrr = hspFilterDistrict[getDist]["all"];
    let arrData = [];
    for (let i = 0; i < arrr.length; i++) {
        arrData.push(totalData[arrr[i]]);
    }
    // console.log(arrr, arrData);
    loadHSPDataToDoc(arrData);
}

function filterHData(distName, arr) {
    let indArr = arr.map((el) => {
        return hspFilterDistrict[distName][el];
    });
    let fltrIndArr, fltrData;
    if (indArr.length > 0) {
        fltrIndArr = indArr.reduce((acc, currEl, currInd) => {
            if (currInd = 0) acc = currEl;
            else {
                let arr1 = acc.filter(value => currEl.includes(value));
                acc = arr1;
            }
            // console.log(acc,currEl);
            return acc;
        });
        // console.log(arr, indArr, fltrIndArr);
        fltrData = fltrIndArr.map((el) => {
            return totalData[el];
        });
    } else {
        fltrData = hspFilterDistrict[distName]["all"].map((el) => {
            return totalData[el];
        });
    }
    // console.log(fltrData);
    loadHSPDataToDoc(fltrData);
    // console.log(distName, arr, indArr);
}

function loadHSPDataToDoc(data) {
    hspDataWrap = document.getElementById("hospitalData");
    hspDataWrap.textContent = "";

    let availObjct = {
        wo_oxygen: "",
        w_oxygen: "",
        wo_ventilator: "",
        w_ventilator: "",
    };

    for (var i = 0; i < data.length; i++) {
        availObjct.wo_oxygen =
            data[i].available_beds_without_oxygen > 0 ?
            "available_beds" :
            "zero_beds";
        availObjct.w_oxygen =
            data[i].available_beds_with_oxygen > 0 ?
            "available_beds" :
            "zero_beds";
        availObjct.wo_ventilator =
            data[i].available_icu_beds_without_ventilator > 0 ?
            "available_beds" :
            "zero_beds";
        availObjct.w_ventilator =
            data[i].available_icu_beds_with_ventilator > 0 ?
            "available_beds" :
            "zero_beds";

        let address = data[i].hospital_address || data[i].district;
        let charges = data[i].charges == "Government" || data[i].charges == "Arogyasri" ? "govt" : "private";
        let hspItem = `  <div class="hospitalItem card flex-cc">
                            <div class="hospitalDetails">
                                <ul class="flex-cc col noBullets">
                                    <li class="hspNameLi flex-cc">
                                        <h4>${data[i].hospital_name.split(",")[0]}</h4>
                                        <a class="hspDetailsLink"
                                            href="https://www.google.com/search?q=rk+hospital+visakhapatnam&newwindow=1&safe=active&rlz=1C1NDCM_enIN870IN870&tbm=lcl&sxsrf=ALeKk031sdxCL0Rwp8wlR5vGEXVtb2pM-Q%3A1624946054051&ei=hrXaYODEAuiO4-EPirSbuAs&oq=rk+hospital+visa&gs_l=psy-ab.3.0.0j0i67k1j0i22i30k1l6.1217929.1224082.0.1224967.8.8.0.0.0.0.244.1364.0j7j1.8.0....0...1c.1.64.psy-ab..0.8.1363...35i39k1j0i273k1j0i433i131k1j0i263i433i20k1j0i263i433i131i20k1j35i457i39k1j0i402k1j0i433i67k1j0i433k1j0i433i131i67k1.0.GVxzB9qYYrs"
                                            title="open in maps" target="-blank" rel="noreferrer noopener">Open in
                                            maps</a>
                                    </li>
                                    <li class="hspChargesLi ${charges}">${
                                        data[i].charges
                                    }</li>
                                    <li class="hspPhoneLi">
                                        <ul class="flex-cc noBullets phoneUl">
                                            <li><a href="#">${
                                                data[i].hospital_phone
                                            }</a></li>
                                            <li class="vertLine"></li>
                                            <li><a href="#">${
                                                data[i].hospital_poc_phone
                                            }</a></li>
                                        </ul>
                                    </li>
                                    <li class="hspAddressLi">${address}</li>
                                </ul>
                            </div>
                            <div class="bedData flex-cc col">
                                <table>
                                    <tr>
                                        <th></th>
                                        <th>
                                            Without Oxygen
                                        </th>
                                        <th>
                                            With Oxygen
                                        </th>
                                        <th>
                                            ICU
                                        </th>
                                        <th>
                                            ICU with Ventilator
                                        </th>
                                    </tr>
                                   <tbody id="data">
                                       <tr>
                                                  <td>
                                            Available
                                        </td>
                                        <td class="${availObjct.wo_oxygen}">
                                            <span>${
                                                data[i]
                                                    .available_beds_without_oxygen
                                            }</span>
                                        </td>
                                        <td class="${availObjct.w_oxygen}">
                                            <span>${
                                                data[i]
                                                    .available_beds_with_oxygen
                                            }</span>
                                        </td>
                                        <td class="${availObjct.wo_ventilator}">
                                            <span>${
                                                data[i]
                                                    .available_icu_beds_without_ventilator
                                            }</span>
                                        </td>
                                        <td class="${availObjct.w_ventilator}">
                                            <span>${
                                                data[i]
                                                    .available_icu_beds_with_ventilator
                                            }</span>
                                        </td>
                                       </tr>
                                   </tbody>
                                    <tr>
                                        <td>
                                            Total
                                        </td>
                                        <td>
                                            <span>${
                                                data[i]
                                                    .total_beds_without_oxygen
                                            }</span>
                                        </td>
                                        <td>
                                            <span>${
                                                data[i].total_beds_with_oxygen
                                            }</span>
                                        </td>
                                        <td>
                                            <span>${
                                                data[i]
                                                    .total_icu_beds_without_ventilator
                                            }</span>
                                        </td>
                                        <td>
                                            <span>${
                                                data[i]
                                                    .total_icu_beds_with_ventilator
                                            }</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>`;
        hspDataWrap.insertAdjacentHTML("beforeend", hspItem);
    }
    if (data.length == 0) {
        let el = `<h3 style="text-align:center">Sorry!
        <br>
        Unable to find hospitals related to your search.
        <br>
        Change your search criteria and try again</h3>`;
        hspDataWrap.insertAdjacentHTML("beforeend", el);
    }
}

export function loadHspData(distName) {

    console.log(distName);
    distName = distName == "Visakhapatnam" ? "Visakhapatanam" : distName;
    // console.log(distConv[distName]); // display name

    hspSect = document.getElementById("hospitalTabContainer");
    putHSPHeaderData(hspSect, distName);
    getDistrictData(distName);

    hspFilterIns = document.querySelectorAll(
        "#hospitalTabContainer .filters input"
    );
    hspFilterBtn = document.getElementById("hspFilterBtn");
    hspClrFilterBtn = document.getElementById("hspClrFilterBtn");
    // console.log(vaccFilterIns.length, vaccFilterbtn);

    hspFilterIns.forEach((chk) => {
        chk.addEventListener("input", (e) => {
            e.target.parentElement.classList.toggle("selected");
            // console.log(e.target.checked);
        });
    });
    hspFilterBtn.addEventListener("click", () => {
        hspFilterIns.forEach((chk) => {
            if (chk.checked) {
                hspSelFilters.push(chk.value);
            }
        });
        // console.log(hspSelFilters);
        filterHData(distName, hspSelFilters);
        hspSelFilters = [];
    });
    hspClrFilterBtn.addEventListener("click", () => {
        hspFilterIns.forEach((chk) => {
            chk.checked = false;
            chk.parentElement.classList.remove("selected");
        });
        hspFilterBtn.click();
    });
}
// ----------siva---------------