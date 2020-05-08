import React from "react";
import { ListItem, ListItemAvatar, Avatar,
    ListItemText } from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import { ecllipse } from "../utils";

export interface Props {
    fileTag: string;
    children?: React.ReactElement;
    onClick?: () => any;
}

export const FileListItem = React.memo(({fileTag, children, onClick}: Props) => {
    return (
        <ListItem button onClick={onClick}>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={ecllipse(fileTag)}
          />
          {/* <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction> */}
          { children }
        </ListItem>
    )
})