# Generated by Django 4.1.1 on 2022-10-15 14:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0015_remove_partyambassador_tx_receipt'),
    ]

    operations = [
        migrations.CreateModel(
            name='Temp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('state_id', models.CharField(default=None, max_length=9)),
                ('image', models.ImageField(default=None, null=True, upload_to='test/voters_images')),
            ],
        ),
    ]
