


export default function Avatar({initials, name, color ='#b0632b', size = 32}){

    return(
        <div className=' rounded-full flex shrink-0 items-center justify-center rounded-full font-semibold text-white'
            title={name}
            style={{background:color, width:size, height:size, fontSize: size * 0.4}}
        >

            {initials}
        </div>
    )

}