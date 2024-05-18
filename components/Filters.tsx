import { FunctionComponent } from "preact";
import { useSignal, Signal } from "@preact/signals";

type BrandFilter_t = {
  brands:string[],
  brandSignal:Signal<string>
}

type IsoFilter_t = {
isos:number[],
isoSignal:Signal<number>
}

type FormatFilter_t = {
formatThirtyFiveSignal:Signal<boolean>,
formatOneTwentySignal:Signal<boolean>
}

type ColorFilter_t = {
colorSignal:Signal<boolean>
}

type NameFilter_t = {
nameSignal:Signal<string>
}



export const BrandFilter: FunctionComponent<BrandFilter_t> = ({brands, brandSignal}) => {
    return(
        <div>
            <select onChange={(e) => brandSignal.value = (e.currentTarget.value)}>
                <option value="any">Brand</option>
                {brands.map(brand => (
                    <option value={brand}>{brand}</option>
                ))}
            </select>
        </div>
    )
}

export const ISOFilter: FunctionComponent<IsoFilter_t> = ({isos, isoSignal}) => {
  return(
      <div>
          <select onChange={(e) => isoSignal.value = parseInt(e.currentTarget.value)}>
              <option value={0}>ISO</option>
              {isos.map(iso => (
                  <option value={iso}>{iso}</option>
              ))}
          </select>
      </div>
  )
}


export const FormatFilter: FunctionComponent<FormatFilter_t> = ({formatThirtyFiveSignal, formatOneTwentySignal}) => {
  return(
      <div className="checkbox-container">
          <input type="checkbox" onChange={(e) => formatThirtyFiveSignal.value = e.currentTarget.checked} />
          <label>ThirtyFive</label>
          <input type="checkbox" onChange={(e) => formatOneTwentySignal.value = e.currentTarget.checked} />
          <label>OneTwenty</label>
      </div>
  )
}

export const ColorFilter: FunctionComponent<ColorFilter_t> = ({colorSignal}) => {
  return(
      <div className="checkbox-container">
          <input type="checkbox" onChange={(e) => colorSignal.value = e.currentTarget.checked} />
          <label>Color</label>
      </div>
  )
}

export const NameFilter: FunctionComponent<NameFilter_t> = ({nameSignal}) => {
  return(
      <div>
          <input type="text" placeholder="Search by Name" onInput={(e) => nameSignal.value = e.currentTarget.value} value = {nameSignal.value}/>
      </div>
  )
}