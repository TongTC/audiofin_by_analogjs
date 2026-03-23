import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './contact.page.html',
})
export default class ContactPage {
  isSending = signal(false);

  async sendMessage(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    this.isSending.set(true);

    // จำลองการเชื่อมต่อ API หรือ Firebase
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert('ส่งข้อความสำเร็จ! เราจะรีบติดต่อกลับหาคุณ');
    this.isSending.set(false);
    form.reset();
  }
}
