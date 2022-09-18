import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import React, { FC } from 'react'
import { BiDotsVertical } from 'react-icons/bi'
import { TbDotsCircleHorizontal } from 'react-icons/tb'

interface TrackOptionsProps {
    options: {
        name: string,
        fn: () => void
    }[]
}

const TrackOptions: FC<TrackOptionsProps> = ({options}) => {

    if (!options.length) return (<></>)

  return (
    <Menu>
        <MenuButton
            as={IconButton}
            border="none"
            icon={<BiDotsVertical/>}
            variant='outline'
        />
        <MenuList>
            {options.map((option,i) => (
                <MenuItem key={i} onClick={option.fn}>
                    {option.name}
                </MenuItem>
            ))}
        </MenuList>
    </Menu>
  )
}

export default TrackOptions