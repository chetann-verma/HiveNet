import { Button } from '../../../../components/Button/Button';
import classes from './RightSidebar.module.scss';
export function RightSidebar()
{
    return (
        <div className={classes.root}>
            <h3>Add to your feed</h3>
            <div className={classes.items}>
                <div className={classes.item}>
                    <img src='/user1.jpeg' alt='' className={classes.avatar}/>
                    <div className={classes.content}>
                        <div className={classes.name}>User1</div>
                        <div className={classes.title}>Developer</div>
                        <Button size="medium" outline className={classes.button}>+Follow</Button>
                    </div>                
                </div>
                <div className={classes.item}>
                    <img src='/user2.jpeg' alt='' className={classes.avatar}/>
                    <div className={classes.content}>
                        <div className={classes.name}>User2</div>
                        <div className={classes.title}>Manager</div>
                        <Button size="medium" outline className={classes.button}>+Follow</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}