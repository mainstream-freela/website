export function totalHeightFromNodeList(children: NodeListOf<HTMLElement>): number{ 
    let totalHeight: number = 0;
    
    if(children.length > 0){
        children.forEach(child => {
          totalHeight += child.clientHeight ?? 0
        });
    }

    return totalHeight;
}