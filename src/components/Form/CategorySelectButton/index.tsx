import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { 
    Container,
    Category,
    Icon,
} from './styles';

interface Props  extends RectButtonProps{
    title: string;
    onPress: () => void;
    isActive: boolean;
}

export function CategorySelectButton({ title, isActive, onPress, testID } : Props) {
    return(
        <Container onPress={onPress} testID={testID}>
            <Category isActive={isActive}>{ title }</Category>
            <Icon name="chevron-down" />
        </Container>
    )
}